const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-raider")
    .setDescription("Creates Raider's Sale information")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Creates Raider information from user mentioned")
        .addMentionableOption((option) =>
          option
            .setName("discord_id")
            .setDescription(
              "The user mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
            )
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

    if (!user.joinedTimestamp) {
      await interaction.reply({
        content: ` <@${user.id}> does not exist in the Discord Server.`,
      });
      return;
    }

    const { roles } = user;

    const raiderRole = await interaction.guild.roles
      .fetch(process.env.RAIDER_ID)
      .catch(console.error);
    await roles.add(raiderRole).catch(console.error);

    const raiderProfile = await client.createRaider(
      interaction.member,
      user.user,
      user.joinedTimestamp
    );
    if (!raiderProfile) {
      await interaction.reply({
        content: `<@${user.user.id}> is already a raider, use \`/show-raider user discord_id:<@${user.id}>\` to show raider information `,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`New ${raiderProfile.userName}'s Raider Information`)
      .setDescription(`Showing <@${user.user.id}>'s raider information`)
      .setColor(0x18e1ee)
      .setTimestamp(Date.now())
      .setAuthor({
        iconURL: user.user.displayAvatarURL(),
        name: user.user.tag,
      })
      .setFooter({
        iconURL: interaction.user.displayAvatarURL(),
        text: interaction.user.tag,
      })
      .addFields([
        {
          name: `Joined Date`,
          value: `<t:${Math.floor(
            raiderProfile.joinedDate.getTime() / 1000
          )}:F>`,
        },
        {
          name: `Last Sale`,
          value: `<t:${Math.floor(raiderProfile.lastSale.getTime() / 1000)}:R>`,
        },
        {
          name: `Last Sign Up`,
          value: `<t:${Math.floor(raiderProfile.lastSignup.getTime() / 1000)}:R>`,
        },
        {
          name: `Server`,
          value: `${raiderProfile.server}`,
        },
        {
          name: `House Location`,
          value: `${raiderProfile.houseAddress}`,
        },
        {
          name: `Amount of Sales`,
          value: `${raiderProfile.sales.length}`,
          inline: true,
        },
        {
          name: `Gil Profits`,
          value: `${raiderProfile.gilProfit}`,
          inline: true,
        },
        {
          name: `Retired`,
          value: `${raiderProfile.isRetired}`,
          inline: true,
        },
      ]);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
