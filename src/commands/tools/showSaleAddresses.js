const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("show-addresses")
    .setDescription("Return a completed sale form")
    .addStringOption((option) =>
      option.setName("sale_id").setDescription("The Sale ID of the sale")
    ),
  async execute(interaction, client) {
    if (interaction.member._roles.indexOf(process.env.SCHEDULER_ID) === -1) {
      await interaction.reply({
        content: ` <@${interaction.member.user.id}> You do not have access to this command`,
        ephemeral: true,
      });
      return;
    }
    const saleId = interaction.options.getString("sale_id");
    const threadId = interaction.channelId;
    let saleProfile = null;
    if (saleId) {
      saleProfile = await client.findRaiderSale(saleId);
      if (!saleProfile) {
        await interaction.reply({
          content: `Sale ID: **${saleId}** does not exist `,
          ephemeral: true,
        });
        return;
      }
    } else {
      saleProfile = await client.findRaiderSaleByThread(
        interaction.member,
        threadId
      );
    }

    if (saleProfile) {
      const raidersProfile = await client.getSaleAddresses(saleProfile);
      let addressList = [];
      for(let raider of raidersProfile) {
        addressList.push(`<@${raider.userId}> Server: **${raider.server}** Address: **${raider.server}**\n`)
      }
      await interaction.reply({
        content: addressList.join(''),
      });
    } else {
      await interaction.reply({
        content: `You must use the \`/show-addresses\` to its appropriate sale thread`,
        ephemeral: true,
      });
    }
  },
};
