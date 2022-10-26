const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("showRaiderInfo")
    .setType(ApplicationCommandType.User),
  async execute(interaction, client) {
    if (interaction.member._roles.indexOf(process.env.RAIDER_ID) === -1) {
      await interaction.reply({
        content: ` <@${interaction.member.user.id}> You do not have access to this command`,
        ephemeral: true,
      });
      return;
    }
    let user = interaction.targetUser;
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
    const embed = new EmbedBuilder()
      .setTitle(`${raiderProfile.userName}'s Raider Information`)
      .setDescription(`Showing <@${user.id}>'s raider information`)
      .setColor(0x18e1ee)
      .setTimestamp(Date.now())
      .setAuthor({
        iconURL: user.displayAvatarURL(),
        name: user.tag,
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
          value: `<t:${Math.floor(
            raiderProfile.lastSale.getTime() / 1000
          )}:R>`,
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
          value: `${raiderProfile.gilProfit.toLocaleString()}`,
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