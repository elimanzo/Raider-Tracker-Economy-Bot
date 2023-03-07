const {
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");
const Ticket = require("../../schemas/ticket");
const TicketSetup = require("../../schemas/ticket-setup");
const mongoose = require("mongoose");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    const { guild, member, customId } = interaction;
    const { ViewChannel, SendMessages, ReadMessageHistory } =
      PermissionFlagsBits;

    const ticketId = Math.floor(Math.random() * 9000) + 10000;

    if (!interaction.isButton()) return;

    const data = await TicketSetup.findOne({ GuildId: guild.id });
    if (!data) return;
    if (!data.Buttons.includes(customId)) return;

    const existingTicket = await Ticket.find({
      clientUserId: member.id,
      Closed: false,
    });

    if (existingTicket.length != 0) {
      interaction.reply({
        content: "You can only have one ticket up at a time",
        ephemeral: true,
      });
      return;
    }

    try {
      await guild.channels
        .create({
          name: `${member.user.username}-ticket-${ticketId}`,
          type: ChannelType.GuildText,
          parent: data.Category,
          permissionOverwrites: [
            {
              id: data.Everyone,
              deny: [ViewChannel, SendMessages, ReadMessageHistory],
            },
            {
              id: member.id,
              allow: [ViewChannel, SendMessages, ReadMessageHistory],
            },
          ],
        })
        .then(async (channel) => {
          const ticketProfile = await Ticket.create({
            _id: mongoose.Types.ObjectId(),
            guildId: guild.id,
            clientUserName: member.username,
            clientUserId: member.id,
            ticketUserIds: [member.id],
            ticketId: ticketId,
            channelId: channel.id,
            Closed: false,
            Locked: false,
            ticketDate: Date.now(),
            Type: customId,
            Claimed: false,
          });
          const embed = new EmbedBuilder()
            .setTitle(`${guild.name} - Ticket: ${customId}`)
            .setDescription(
              "Our Scheduling Team will contact you shortly. Please describe what you need."
            )
            .setFooter({
              text: `${ticketId}`,
              inconURL: member.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

          const button = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId("close")
              .setLabel("Close ticket")
              .setStyle(ButtonStyle.Primary)
              .setEmoji("❌"),
            new ButtonBuilder()
              .setCustomId("lock")
              .setLabel("Lock the ticket")
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("🔐"),
            new ButtonBuilder()
              .setCustomId("unlock")
              .setLabel("Unlock the ticket")
              .setStyle(ButtonStyle.Success)
              .setEmoji("🔓"),
            new ButtonBuilder()
              .setCustomId("claim")
              .setLabel("Claim the ticket")
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("🛄")
          );

          channel.send({
            embeds: [embed],
            components: [button],
          });

          interaction.reply({
            content: "Successfully created a ticket.",
            ephemeral: true,
          });
        });
    } catch (err) {
      return console.log(err);
    }
  },
};
