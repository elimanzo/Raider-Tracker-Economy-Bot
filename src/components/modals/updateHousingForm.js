const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: `raiderHousingUpdateForm`
  },
  async execute(interaction, client) {
    const discordId = interaction.fields.getTextInputValue("discordId").trim();
    const address = interaction.fields.getTextInputValue("address");
    const server = interaction.fields.getTextInputValue("server");
    let raiderProfile = await client.updateRaiderAddress(
      interaction.member,
      discordId,
      address,
      server
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
      content: `<@${raiderProfile.userId}> your new server is **${raiderProfile.server}** and address **${raiderProfile.houseAddress}**`,
    });
  },
};
