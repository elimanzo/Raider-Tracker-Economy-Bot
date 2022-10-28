const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("retire-raider")
    .setDescription("Retires a Raider")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Retires/Unretires user mentioned")
        .addMentionableOption((option) =>
          option
            .setName("discord_id")
            .setDescription(
              "The user mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
            )
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    if (interaction.member._roles.indexOf(process.env.LEADER_ID) === -1) {
      await interaction.reply({
        content: ` <@${interaction.member.user.id}> You do not have access to this command`,
        ephemeral: true,
      });
      return;
    }
    let user = interaction.options.getMentionable("discord_id")
      ? interaction.options.getMentionable("discord_id")
      : interaction.member;

    const { roles } = user;
    const raiderRole = await interaction.guild.roles
      .fetch(process.env.RAIDER_ID)
      .catch(console.error);
    const retiredRole = await interaction.guild.roles
      .fetch(process.env.RETIRED_ID)
      .catch(console.error);
    
    const raiderProfile = await client.findRaider(
      interaction.member,
      user.user.id
    );
    if (!raiderProfile) {
      await interaction.reply({
        content: ` <@${user.user.id}> does not exist, use \`/create-raider user discord_id:<@${user.user.id}>\` to create a new Raider `,
      });
      return;
    }

    await client.retireRaider(
      interaction.member,
      user.user.id,
      raiderProfile.isRetired
    );

    if (raiderProfile.isRetired) {
      await roles.remove(retiredRole).catch(console.error);
      await roles.add(raiderRole).catch(console.error);
      await interaction.reply({
        content: `<@${user.user.id}> is out of retirement! Use \`/show-raider user discord_id:<@${user.user.id}>\` to show Raider information `,
      });
    } else {
      await roles.remove(raiderRole).catch(console.error);
      await roles.add(retiredRole).catch(console.error);
      await interaction.reply({
        content: `Welcome <@${user.user.id}> to retirement! Use \`/show-raider user discord_id:<@${user.user.id}>\` to show Raider information `,
      });
    }
  },
};
