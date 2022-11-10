const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("show-sale")
    .setDescription("Creates a Raiders Sale")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("sale")
        .setDescription("Shows a Raider sale from the ID provided")
        .addStringOption((option) =>
          option.setName("sale_id").setDescription("Sale ID'")
        )
    ),
  async execute(interaction, client) {
    if (interaction.member._roles.indexOf(process.env.SCHEDULER_ID) === -1) {
      await interaction.reply({
        content: ` <@${interaction.member.user.id}> You do not have access to this command`,
        ephemeral: true,
      });
      return;
    }
    let mentionableList = [];
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
      if (!saleProfile) {
        await interaction.reply({
          content: `Command \`/show-sale\` is not in its appropriate Sale Thread`,
          ephemeral: true,
        });
        return;
      }
    }

    for (let i = 0; i < saleProfile.raiders.totalRaiders; i++) {
      mentionableList.push(
        `\n<@${
          saleProfile.raiders.raiderIds[i]
        }> - ${saleProfile.raiders.raiderPayout[i].toLocaleString()} gil`
      );
    }

    const embed = new EmbedBuilder()
      .setTitle(`${saleProfile.saleType}'s Sale Information`)
      .setDescription(
        `Displaying the Sale Information for ***${saleProfile.saleType}***`
      )
      .setURL(saleProfile.saleThreadUrl)
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

    await interaction.reply({
      embeds: [embed],
    });
  },
};
