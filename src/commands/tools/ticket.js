const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const Ticket = require("../../schemas/ticket");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Ticket actions")
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("Add or remove members from the ticket")
        .setRequired(true)
        .addChoices(
          { name: "Add", value: "add" },
          { name: "Remove", value: "remove" }
        )
    )
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription(
          "Select a member from the discord server to perfom the action on"
        )
        .setRequired(true)
    ),
  async execute(interaction, client) {
    if (interaction.member._roles.indexOf(process.env.SCHEDULER_ID) === -1) {
      return await interaction.reply({
        content: ` <@${interaction.member.user.id}> You do not have access to this command`,
        ephemeral: true,
      });
    }
    const { guildId, options, channel } = interaction;
    const action = options.getString("action");
    const member = options.getUser("member");
    const embed = new EmbedBuilder();
    switch (action) {
      case "add":
        Ticket.findOne(
          { guildId: guildId, channelId: channel.id },
          async (err, data) => {
            if (err) throw err;
            if (!data)
              return interaction.reply({
                embeds: [
                  embed
                    .setColor("Red")
                    .setDescription("Something went wrong. Try again later."),
                ],
                ephemeral: true,
              });
            if (data.ticketUserIds.includes(member.id))
              return interaction.reply({
                embeds: [
                  embed
                    .setColor("Red")
                    .setDescription("Something went wrong. Try again later."),
                ],
                ephemeral: true,
              });
            data.ticketUserIds.push(member.id);
            channel.permissionOverwrites.edit(member.id, {
              SendMessages: true,
              ViewChannel: true,
              ReadMessageHistory: true,
            });
            interaction.reply({
              embeds: [
                embed
                  .setColor("Green")
                  .setDescription(`${member} has been added to the ticket`),
              ],
            });
            data.save();
          }
        );
        break;
      case "remove":
        Ticket.findOne(
          { guildId: guildId, channelId: channel.id },
          async (err, data) => {
            if (err) throw err;
            if (!data)
              return interaction.reply({
                embeds: [
                  embed
                    .setColor("Red")
                    .setDescription("Something went wrong.Try again later."),
                ],
                ephemeral: true,
              });
            if (!data.ticketUserIds.includes(member.id))
              return interaction.reply({
                embeds: [
                  embed
                    .setColor("Red")
                    .setDescription("Something went wrong.Try again later."),
                ],
                ephemeral: true,
              });
            data.ticketUserIds.remove(member.id);
            channel.permissionOverwrites.edit(member.id, {
              SendMessages: false,
              ViewChannel: false,
              ReadMessageHistory: false,
            });
            interaction.reply({
              embeds: [
                embed
                  .setColor("Green")
                  .setDescription(`${member} has been remove from the ticket`),
              ],
            });
            data.save();
          }
        );
        break;
    }
  },
};
