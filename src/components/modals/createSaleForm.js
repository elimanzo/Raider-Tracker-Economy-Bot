const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: `raiderSaleForm`,
  },
  async execute(interaction, client) {
    let mentionableList = [];
    let saleCost = 0;
    const clientId = interaction.fields.getTextInputValue("clientId").trim();
    const saleType = interaction.fields.getTextInputValue("saleType");
    const saleDate = new Date(interaction.fields.getTextInputValue("saleDate"));
    const raiderIds = interaction.fields
      .getTextInputValue("raiderIds")
      .split(",")
      .map(function (value) {
        return value.trim();
      });
    const gilAmounts = interaction.fields
      .getTextInputValue("gilAmounts")
      .split(",")
      .map(function (value) {
        return value.trim();
      });

    // Input Validation

    if (!(saleDate instanceof Date) || isNaN(saleDate)) {
      await interaction.reply({
        content:
          "Invalid Date Input (Make sure the date has the correct format (YYYY-MM-DD)",
      });
      return;
    }

    if (gilAmounts.length !== raiderIds.length) {
      await interaction.reply({
        content:
          "Invalid User Input (total amount of Raider IDs/Gil Amounts do not match)",
      });
      return;
    }

    for (let i = 0; i < raiderIds.length; i++) {
      if (
        isNaN(raiderIds[i]) ||
        isNaN(gilAmounts[i]) ||
        Number(gilAmounts[i]) <= 0
      ) {
        await interaction.reply({
          content:
            "Invalid User Input (Raider IDs/Gil Amounts were either not a number or a number <= 0)",
        });
        return;
      }
      saleCost += Number(gilAmounts[i]);
    }

    for (let i = 0; i < raiderIds.length; i++) {
      const raiderProfile = await client.findRaider(
        interaction.member,
        raiderIds[i]
      );
      if (!raiderProfile) {
        await interaction.reply({
          content: ` <@${raiderIds[i]}> does not exist, use \`/create-raider user discord_id:<@${raiderIds[i]}>\` to create a new Raider `,
        });
        return;
      }
      mentionableList.push(
        `\n<@${raiderIds[i]}> - ${parseInt(gilAmounts[i]).toLocaleString()} gil`
      );
    }

    const saleProfile = await client.createSale(
      interaction.member,
      saleType,
      saleDate,
      saleCost,
      raiderIds,
      gilAmounts,
      clientId
    );
    const embed = new EmbedBuilder()
      .setTitle(`${saleProfile.saleType}'s Sale Information`)
      .setDescription(`Displaying the Sale ***${saleProfile.saleType}***`)
      .setColor(0x18e1ee)
      .setTimestamp(Date.now())
      .setAuthor({
        iconURL: interaction.user.displayAvatarURL(),
        name: interaction.user.tag,
      })
      .setFooter({
        iconURL: interaction.user.displayAvatarURL(),
        text: interaction.user.tag,
      })
      .addFields([
        {
          name: `Sale ID`,
          value: `||\`${saleProfile._id}\`||`,
        },
        {
          name: `Sale Participants`,
          value: `${mentionableList.join("")}`,
        },
        {
          name: `Scheduler`,
          value: `<@${saleProfile.scheduler}>`,
          inline: true,
        },
        {
          name: `Client`,
          value: `<@${saleProfile.clientId}>`,
          inline: true,
        },
        {
          name: `Sale Date`,
          value: `<t:${Math.floor(saleProfile.saleDate.getTime() / 1000)}:D>`,
        },
        {
          name: `Date Submitted`,
          value: `<t:${Math.floor(
            saleProfile.dateSubmitted.getTime() / 1000
          )}:R>`,
        },
        {
          name: `Total Raiders`,
          value: `${saleProfile.raiders.totalRaiders}`,
          inline: true,
        },
        {
          name: `Total Sale Cost`,
          value: `${saleProfile.gilProfit.toLocaleString()}`,
          inline: true,
        },
      ]);

    // Updates every Raider that completed the sale
    for (let i = 0; i < raiderIds.length; i++) {
      const raiderProfile = await client.changeFunds(
        interaction.member,
        raiderIds[i],
        Number(gilAmounts[i]),
        saleProfile._id.toString()
      );
    }
    await interaction.reply({
      embeds: [embed],
    });
  },
};
