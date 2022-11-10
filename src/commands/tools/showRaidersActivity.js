const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("activity")
    .setDescription("Shows All Active Raiders activity"),
  async execute(interaction, client) {
    if (interaction.member._roles.indexOf(process.env.SCHEDULER_ID) === -1) {
      await interaction.reply({
        content: ` <@${interaction.member.user.id}> You do not have access to this command`,
        ephemeral: true,
      });
      return;
    }

    let contentList = [];
    const raidersProfile = await client.getRaidersActivity();
    const salesProfile = await client.getMonthlySales();
    contentList.push(`There has been **${salesProfile.length}** sales in the past 30 days\n`);
    for (let i = 0; i < raidersProfile.length; i++) {
        contentList.push(`<@${raidersProfile[i].userId}> last sale was on <t:${Math.floor(raidersProfile[i].lastSale.getTime() / 1000)}:F> **<t:${Math.floor(raidersProfile[i].lastSale.getTime() / 1000)}:R>**. Last Signup was **<t:${Math.floor(raidersProfile[i].lastSignup.getTime() / 1000)}:R>**\n`)
    }

    await interaction.reply({
      content: `${contentList.join("")}`,
      ephemeral: true,
    });
  },
};
