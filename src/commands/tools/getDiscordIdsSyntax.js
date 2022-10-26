const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("get-discord-ids")
    .setDescription(
      "Gets Discord Ids of 1 or more (upto 10 and in order from least to greatest)"
    )
    .addUserOption((option) =>
      option
        .setName("discord_id_0")
        .setDescription(
          "The user mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
        )
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("discord_id_1")
        .setDescription(
          "The user mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
        )
    )
    .addUserOption((option) =>
      option
        .setName("discord_id_2")
        .setDescription(
          "The user mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
        )
    )
    .addUserOption((option) =>
      option
        .setName("discord_id_3")
        .setDescription(
          "The user mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
        )
    )
    .addUserOption((option) =>
      option
        .setName("discord_id_4")
        .setDescription(
          "The user mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
        )
    )
    .addUserOption((option) =>
      option
        .setName("discord_id_5")
        .setDescription(
          "The user mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
        )
    )
    .addUserOption((option) =>
      option
        .setName("discord_id_6")
        .setDescription(
          "The user mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
        )
    )
    .addUserOption((option) =>
      option
        .setName("discord_id_7")
        .setDescription(
          "The user mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
        )
    )
    .addUserOption((option) =>
      option
        .setName("discord_id_8")
        .setDescription(
          "The user mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
        )
    )
    .addUserOption((option) =>
      option
        .setName("discord_id_9")
        .setDescription(
          "The user mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
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
    mentionedUsers = [];
    for (let i = 0; i < 10; i++) {
      if (interaction.options.getUser(`discord_id_${i}`)) {
        mentionedUsers.push(interaction.options.getUser(`discord_id_${i}`).id);
      }
    }
    await interaction.reply({
      content: `Mentioned Users ID: \`${String(mentionedUsers)}\``,
      ephemeral: true,
    });
  },
};
