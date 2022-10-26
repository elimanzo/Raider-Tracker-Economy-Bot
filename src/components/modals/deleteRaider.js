const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: `raiderDeleteForm`,
  },
  async execute(interaction, client) {
    const discordId = interaction.fields.getTextInputValue("discordId").trim();
    const confirmation = interaction.fields.getTextInputValue("confirmation").trim();
    const raiderProfile = await client.findRaider(
      interaction.member,
      discordId
    );
    if (!raiderProfile) {
      await interaction.reply({
        content: `No Discord ID was found (Do not change the discord ID in the update form)`,
      });
      return;
    }
    if (confirmation.toUpperCase() === "YES") {
      await client.deleteRaider(interaction.member, discordId);
      await interaction.reply({
        content: `<@${discordId}> is no longer a part of the Raider Team`,
        ephemeral: true
      });
      return;
    } else {
      await interaction.reply({
        content: `<@${discordId}> was not deleted`,
        ephemeral: true
      });
      return;
    }
  },
};
