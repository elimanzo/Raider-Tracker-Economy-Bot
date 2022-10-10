module.exports = {
    data: {
        name: `lofi-music`
    },
    async execute(interaction, client) {
        await interaction.reply({
            content: `https://www.youtube.com/watch?v=OE5FPbr8F6c`
        });
    }
}