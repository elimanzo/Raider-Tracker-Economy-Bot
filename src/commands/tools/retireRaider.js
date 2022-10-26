const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("retire-raider")
    .setDescription("Retires a Raider")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Retires/Unretires user mentioned")
        .addUserOption((option) =>
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
    let user = interaction.options.getUser("discord_id")
      ? interaction.options.getUser("discord_id")
      : interaction.user;
    const raiderProfile = await client.findRaider(
      interaction.member,
      user.id
    );
    if (!raiderProfile) {
      await interaction.reply({
        content: ` <@${user.id}> does not exist, use \`/create-raider user discord_id:<@${user.id}>\` to create a new Raider `,
      });
      return;
    }

    await client.retireRaider(
      interaction.member,
      user.id,
      raiderProfile.isRetired
    );

    if(raiderProfile.isRetired) {
      await interaction.reply({
        content: `<@${user.id}> is out of retirement! Use \`/show-raider user discord_id:<@${user.id}>\` to show Raider information `,
      });
    } else {
      await interaction.reply({
        content: `Welcome <@${user.id}> to retirement! Use \`/show-raider user discord_id:<@${user.id}>\` to show Raider information `,
      });
    }
  }
};
