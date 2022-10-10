const {
  SlashCommandBuilder,
  SelectMenuBuilder,
  ActionRowBuilder,
  SelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("menu")
    .setDescription("Return my select menu!"),
  async execute(interaction, client) {
    const menu = new SelectMenuBuilder()
      .setCustomId(`sub-menu`)
      .setMinValues(1)
      .setMaxValues(1)
      .setOptions(
        new SelectMenuOptionBuilder({
          label: `Option #1`,
          value: `https://www.youtube.com/watch?v=OE5FPbr8F6c`,
        }),
        new SelectMenuOptionBuilder({
          label: `Option #2`,
          value: `https://www.youtube.com/watch?v=0E5FPbr8F6c`,
        })
      );

    await interaction.reply({
      components: [new ActionRowBuilder().addComponents(menu)],
    });
  },
};
