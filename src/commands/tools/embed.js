const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Return my embed'),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
        .setTitle(`This is an EMBED!`)
        .setDescription(`This is a nice description!`)
        .setColor(0x18e1ee)
        .setImage(client.user.displayAvatarURL())
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp(Date.now())
        .setAuthor({
            url: `https://www.youtube.com/watch?v=OE5FPbr8F6c`,
            iconURL: interaction.user.displayAvatarURL(),
            name: interaction.user.tag,
        })
        .setFooter({
            iconURL: client.user.displayAvatarURL(),
            text: client.user.tag
        })
        .setURL(`https://www.youtube.com/watch?v=OE5FPbr8F6c`)
        .addFields ([
            {
                name:`Field 1`,
                value: `Field value 1`,
                inline: true,
            },
            {
                name:`Field 2`,
                value: `Field value 2`,
                inline: true,
            },
        ]);

        await interaction.reply ({
            embeds: [embed]
        });
  },
};
