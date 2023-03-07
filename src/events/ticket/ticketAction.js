const { EmbedBuilder } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
const Ticket = require("../../schemas/ticket");
const TicketSetup = require("../../schemas/ticket-setup");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    const { guild, member, customId, channel } = interaction;

    if (!interaction.isButton()) return;

    if (!["close", "lock", "unlock", "claim"].includes(customId)) return;

    const docs = await TicketSetup.findOne({ GuildId: guild.id });

    if (!docs) return;
    if (interaction.member._roles.indexOf(docs.Handlers) === -1)
      return interaction.reply({
        content: "You don't have permissions for this.",
        ephemeral: true,
      });

    const embed = new EmbedBuilder().setColor("Aqua");

    Ticket.findOne({ channelId: channel.id }, async (err, data) => {
      if (err) throw err;
      if (!data) return;

      const fetchedClient = await guild.members.cache.get(data.clientUserId);
      switch (customId) {
        case "close":
          if (data.Closed)
            return interaction.reply({
              content: "Ticket is already getting deleted...",
              ephemeral: true,
            });

          const transcript = await createTranscript(channel, {
            limit: -1,
            returnBuffer: false,
            filename: `transcript-${member.user.username}-${data.Type}-ticket-${data.ticketId}.html`,
            poweredBy: false,
          });
          const transcriptEmbed = new EmbedBuilder()
            .setTitle(`Ticket Transcript Information`)
            .setColor(0x18e1ee)
            .setTimestamp()
            .setAuthor({
              iconURL: fetchedClient.displayAvatarURL({ dynamic: true }),
              name:
                fetchedClient.user.username +
                "#" +
                fetchedClient.user.discriminator,
            })
            .setFooter({
              iconURL: interaction.user.displayAvatarURL(),
              text: interaction.user.tag,
            })
            .addFields([
              {
                name: `Ticket Owner`,
                value: `<@${data.clientUserId}>`,
                inline: true,
              },
              {
                name: `Ticket Type`,
                value: `${data.Type}`,
                inline: true,
              },
              {
                name: `Ticket ID`,
                value: `${data.ticketId}`,
                inline: true,
              },
              {
                name: `Scheduler`,
                value: `<@${data.scheduler}>`,
                inline: true,
              },
            ]);

          const transcriptProcess = new EmbedBuilder()
            .setTitle("Saving transcript...")
            .setDescription(
              "Ticket will be closed in 10 seconds, enable DM's for the ticket transcript."
            )
            .setColor("Red")
            .setFooter({
              text:
                fetchedClient.user.username +
                "#" +
                fetchedClient.user.discriminator,
              iconURL: fetchedClient.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

          const res = await guild.channels.cache.get(docs.Transcripts).send({
            embeds: [transcriptEmbed],
            files: [transcript],
          });

          await Ticket.updateOne(
            { channelId: channel.id },
            { Closed: true, transcriptURL: res.attachments.first()?.url }
          );

          interaction.reply({ embeds: [transcriptProcess] });

          setTimeout(function () {
            fetchedClient
              .send({
                embeds: [transcriptEmbed],
                files: [transcript],
              })
              .catch(() =>
                channel.send("Couldn't send transcript to Direct Message.")
              );
            channel.delete();
          }, 10000);

          break;

        case "lock":
          if (interaction.member._roles.indexOf(docs.Handlers) === -1)
            return interaction.reply({
              content: "You don't have permissions for that.",
              ephemeral: true,
            });

          if (data.Locked)
            return interaction.reply({
              content: "Ticket is already set to locked.",
              ephemeral: true,
            });

          await Ticket.updateOne({ channelId: channel.id }, { Locked: true });
          embed.setDescription("Ticket was locked successfully 🔐");
          data.ticketUserIds.forEach((m) => {
            channel.permissionOverwrites.edit(m, { SendMessages: false });
          });

          return interaction.reply({ embeds: [embed] });
        case "unlock":
          if (interaction.member._roles.indexOf(docs.Handlers) === -1)
            return interaction.reply({
              content: "You don't have permissions for that.",
              ephemeral: true,
            });

          if (!data.Locked)
            return interaction.reply({
              content: "Ticket is already set to unlocked.",
              ephemeral: true,
            });

          await Ticket.updateOne({ channelId: channel.id }, { Locked: false });
          embed.setDescription("Ticket was unlocked successfully 🔓");

          data.ticketUserIds.forEach((m) => {
            channel.permissionOverwrites.edit(m, { SendMessages: true });
          });

          return interaction.reply({ embeds: [embed] });
        case "claim":
          if (interaction.member._roles.indexOf(docs.Handlers) === -1)
            return interaction.reply({
              content: "You don't have permissions for that.",
              ephemeral: true,
            });

          if (data.Claimed) {
            return interaction.reply({
              content: `Ticket has already been claimed by <@${data.scheduler}>`,
              ephemeral: true,
            });
          }

          await Ticket.updateOne(
            { channelId: channel.id },
            { Claimed: true, scheduler: member.id }
          );

          embed.setDescription(`Ticket was successfully claimed by ${member}`);

          interaction.reply({ embeds: [embed] });
      }
    });
  },
};
