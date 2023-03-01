const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: `raiderHousingUpdateForm`
  },
  async execute(interaction, client) {
    const discordId = interaction.fields.getTextInputValue("discordId").trim();
    const dataCenter = interaction.fields.getTextInputValue("dataCenter");
    const address = interaction.fields.getTextInputValue("address");
    const server = interaction.fields.getTextInputValue("server");
    let raiderProfile = await client.updateRaiderAddress(
      interaction.member,
      discordId,
      address,
      server,
      dataCenter
    );
    if (!raiderProfile) {
      await interaction.reply({
        content: `No Discord ID was found (Do not change the discord ID in the update form)`,
      });
      return;
    }
    raiderProfile = await client.findRaider(
      interaction.member,
      discordId
    );
    await interaction.reply({
      content: `<@${raiderProfile.userId}>\nData Center:**${raiderProfile.dataCenter}\n**Server: **${raiderProfile.server}**\nAddress: **${raiderProfile.houseAddress}**`,
      ephemeral: true
    });
  },
};
