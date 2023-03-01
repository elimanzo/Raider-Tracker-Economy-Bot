const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reschedule-sale")
    .setDescription("Reschedules a sale")
    .addMentionableOption((option) =>
      option
        .setName("raiders_role")
        .setDescription("The raider role that you'd want to ping")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription(
          "Date and Time of the sale (Template: MM/DD/YYYY HH:MM AM/PM TIMEZONE) Ex. '08/20/2022 8:00 PM EDT')"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("confirmation")
        .setDescription("To confirm cancelation type `yes`")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    if (interaction.member._roles.indexOf(process.env.SCHEDULER_ID) === -1) {
      await interaction.reply({
        content: ` <@${interaction.member.user.id}> You do not have access to this command`,
        ephemeral: true,
      });
      return;
    }
    const milliSec = 60000; // how many milliseconds in a minute
    const saleDate =
      interaction.options.getString("date").toUpperCase() === "ASAP"
        ? Date.now() + 30 * milliSec
        : Date.parse(interaction.options.getString("date"));
    const raiderRole = interaction.options.getMentionable("raiders_role");
    const confirmation = interaction.options.getString("confirmation");
    const threadId = interaction.channelId;

    // A role must be pinged
    if (raiderRole.user) {
      await interaction.reply({
        content: `You need to mention a role not a user`,
        ephemeral: true,
      });
      return;
    }

    // Must be a valid date
    if (saleDate < Date.now() || isNaN(saleDate)) {
      await interaction.reply({
        content: `Incorrect Date Format or Date is in the past. Please have a correct date format (\`MM/DD/YYYY HH:MM AM/PM TIMEZONE\`) `,
        ephemeral: true,
      });
      return;
    }

    // Sale date cannot be longer than a 32 bit integer
    if ((saleDate - Date.now()) > Math.pow(2, 31) - 1) {
      await interaction.reply({
        content: `Sales cannot be scheduled over 24.8 days out.`,
        ephemeral: true,
      });
      return;
    }

    if (confirmation.toUpperCase() === "YES") {
      const saleProfile = await client.rescheduleSaleByThread(
        interaction.member,
        threadId,
        new Date(saleDate)
      );

      if (!saleProfile) {
        await interaction.reply({
          content: `Sale does not exist or You must be in the appropriate sale thread`,
        });
        return;
      }

      // Clean Thread Titles
      const formattedDate =
        interaction.options.getString("date").toUpperCase() === "ASAP"
          ? "ASAP"
          : new Date(saleDate).toLocaleDateString("en-us", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              timeZone: "America/New_York",
              timeZoneName: "short",
              hour12: true,
            });
      await interaction.reply({
        content: `Sale has been rescheduled`,
        ephemeral: true,
      });

      const rescheduleContent =
        interaction.options.getString("date").toUpperCase() === "ASAP"
          ? `<@&${raiderRole.id}> ${saleProfile.saleType} Sale has been rescheduled to an ASAP sale. Please update your signup reactions!`
          : `<@&${raiderRole.id}> ${
              saleProfile.saleType
            } Sale has been rescheduled! New Sale Date: <t:${Math.floor(
              saleDate / 1000
            )}:F> - <t:${Math.floor(
              saleDate / 1000
            )}:R> Please update your signup reactions!`;

      const rescheduleMessage = await interaction.channel.send({
        content: rescheduleContent,
      });
      await interaction.channel.setName(
        `${formattedDate} - ${saleProfile.saleType}`
      );
      await rescheduleMessage.pin();
    } else {
      await interaction.reply({
        content: `Sale was not rescheduled`,
        ephemeral: true,
      });
    }
  },
};
