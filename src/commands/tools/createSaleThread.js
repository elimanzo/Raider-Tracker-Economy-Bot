const { SlashCommandBuilder } = require("discord.js");

function setValue(map, key, role, chest, chesterPrio) {
  if (!map.has(key)) {
    const mySet = new Set();
    if (chesterPrio) {
      map.set(key, [mySet.add(chest), Date.now()]);
      map.get(key)[0].add(role);
    } else {
      map.set(key, [mySet.add(role), Date.now()]);
    }
    return;
  }
  map.get(key)[0].add(role);
}

function removeValue(map, key, value) {
  if (!map.has(key)) {
    return;
  }
  map.get(key)[0].delete(value);
}

function updateRosterWithChestPrio(
  signUps,
  comp,
  tankEmoji,
  healerEmoji,
  dpsEmoji
) {
  let roster = { tanks: [], healers: [], dps: [], subs: [] };
  for (let [key, value] of signUps) {
    if (
      roster.tanks.length + roster.healers.length + roster.dps.length ===
      comp.chestSize
    ) {
      roster.subs.push([key, value]);
      continue;
    }
    if (
      roster.tanks.length + roster.healers.length + roster.dps.length ===
      comp.tankSize + comp.healerSize + comp.dpsSize
    ) {
      roster.subs.push([key, value]);
    } else {
      if (value[0].has(tankEmoji) && roster.tanks.length < comp.tankSize) {
        roster.tanks.push([key, value]);
      } else if (
        value[0].has(healerEmoji) &&
        roster.healers.length < comp.healerSize
      ) {
        roster.healers.push([key, value]);
      } else if (value[0].has(dpsEmoji) && roster.dps.length < comp.dpsSize) {
        roster.dps.push([key, value]);
      } else {
        let flexerSwapped = false;
        // checks if the rest of the roster can flex
        for (let role of value[0]) {
          if (flexerSwapped) {
            break;
          }
          if (role === tankEmoji) {
            for (let tank of roster.tanks) {
              if (
                tank[1][0].has(healerEmoji) &&
                roster.healers.length !== comp.healerSize
              ) {
                roster.healers.push(tank);
                roster.tanks.splice(roster.tanks.indexOf(tank), 1);
                roster.tanks.push([key, value]);
                flexerSwapped = true;
                break;
              } else if (
                tank[1][0].has(dpsEmoji) &&
                roster.dps.length !== comp.dpsSize
              ) {
                roster.dps.push(tank);
                roster.tanks.splice(roster.tanks.indexOf(tank), 1);
                roster.tanks.push([key, value]);
                flexerSwapped = true;
                break;
              }
            }
          }
          if (role === healerEmoji) {
            for (let healer of roster.healers) {
              if (
                healer[1][0].has(tankEmoji) &&
                roster.tanks.length !== comp.tankSize
              ) {
                roster.tanks.push(healer);
                roster.healers.splice(roster.healers.indexOf(healer), 1);
                roster.healers.push([key, value]);
                flexerSwapped = true;
                break;
              } else if (
                healer[1][0].has(dpsEmoji) &&
                roster.dps.length !== comp.dpsSize
              ) {
                roster.dps.push(healer);
                roster.healers.splice(roster.healers.indexOf(healer), 1);
                roster.healers.push([key, value]);
                flexerSwapped = true;
                break;
              }
            }
          }
          if (role === dpsEmoji) {
            for (let dps of roster.dps) {
              if (
                dps[1][0].has(tankEmoji) &&
                roster.tanks.length !== comp.tankSize
              ) {
                roster.tanks.push(dps);
                roster.dps.splice(roster.dps.indexOf(dps), 1);
                roster.dps.push([key, value]);
                flexerSwapped = true;
                break;
              } else if (
                dps[1][0].has(healerEmoji) &&
                roster.healers.length !== comp.healerSize
              ) {
                roster.healers.push(dps);
                roster.dps.splice(roster.dps.indexOf(dps), 1);
                roster.dps.push([key, value]);
                flexerSwapped = true;
                break;
              }
            }
          }
        }
        // No Flexers = They Become a Sub
        if (!flexerSwapped) {
          roster.subs.push([key, value]);
        }
      }
    }
  }
  return roster;
}

function updateRoster(
  signUps,
  chestSignUps,
  comp,
  tankEmoji,
  healerEmoji,
  dpsEmoji
) {
  let roster = { tanks: [], healers: [], dps: [], subs: [] };
  if (comp.chestSize !== 0) {
    roster = updateRosterWithChestPrio(
      chestSignUps,
      comp,
      tankEmoji,
      healerEmoji,
      dpsEmoji
    );
  }

  for (let [key, value] of signUps) {
    if (roster.tanks.length != 0) {
      if (roster.tanks[0].indexOf(key) !== -1) {
        roster.subs.push([key, value]);
        continue;
      }
    }
    if (roster.healers.length != 0) {
      if (roster.healers[0].indexOf(key) !== -1) {
        roster.subs.push([key, value]);
        continue;
      }
    }
    if (roster.dps.length != 0) {
      if (roster.dps[0].indexOf(key) !== -1) {
        roster.subs.push([key, value]);
        continue;
      }
    }
    if (
      roster.tanks.length + roster.healers.length + roster.dps.length ===
      comp.tankSize + comp.healerSize + comp.dpsSize
    ) {
      roster.subs.push([key, value]);
    } else {
      if (value[0].has(tankEmoji) && roster.tanks.length < comp.tankSize) {
        roster.tanks.push([key, value]);
      } else if (
        value[0].has(healerEmoji) &&
        roster.healers.length < comp.healerSize
      ) {
        roster.healers.push([key, value]);
      } else if (value[0].has(dpsEmoji) && roster.dps.length < comp.dpsSize) {
        roster.dps.push([key, value]);
      } else {
        let flexerSwapped = false;
        // checks if the rest of the roster can flex
        for (let role of value[0]) {
          if (flexerSwapped) {
            break;
          }
          if (role === tankEmoji) {
            for (let tank of roster.tanks) {
              if (
                tank[1][0].has(healerEmoji) &&
                roster.healers.length !== comp.healerSize
              ) {
                roster.healers.push(tank);
                roster.tanks.splice(roster.tanks.indexOf(tank), 1);
                roster.tanks.push([key, value]);
                flexerSwapped = true;
                break;
              } else if (
                tank[1][0].has(dpsEmoji) &&
                roster.dps.length !== comp.dpsSize
              ) {
                roster.dps.push(tank);
                roster.tanks.splice(roster.tanks.indexOf(tank), 1);
                roster.tanks.push([key, value]);
                flexerSwapped = true;
                break;
              }
            }
          }
          if (role === healerEmoji) {
            for (let healer of roster.healers) {
              if (
                healer[1][0].has(tankEmoji) &&
                roster.tanks.length !== comp.tankSize
              ) {
                roster.tanks.push(healer);
                roster.healers.splice(roster.healers.indexOf(healer), 1);
                roster.healers.push([key, value]);
                flexerSwapped = true;
                break;
              } else if (
                healer[1][0].has(dpsEmoji) &&
                roster.dps.length !== comp.dpsSize
              ) {
                roster.dps.push(healer);
                roster.healers.splice(roster.healers.indexOf(healer), 1);
                roster.healers.push([key, value]);
                flexerSwapped = true;
                break;
              }
            }
          }
          if (role === dpsEmoji) {
            for (let dps of roster.dps) {
              if (
                dps[1][0].has(tankEmoji) &&
                roster.tanks.length !== comp.tankSize
              ) {
                roster.tanks.push(dps);
                roster.dps.splice(roster.dps.indexOf(dps), 1);
                roster.dps.push([key, value]);
                flexerSwapped = true;
                break;
              } else if (
                dps[1][0].has(healerEmoji) &&
                roster.healers.length !== comp.healerSize
              ) {
                roster.healers.push(dps);
                roster.dps.splice(roster.dps.indexOf(dps), 1);
                roster.dps.push([key, value]);
                flexerSwapped = true;
                break;
              }
            }
          }
        }
        // No Flexers = They Become a Sub
        if (!flexerSwapped) {
          roster.subs.push([key, value]);
        }
      }
    }
  }
  return roster;
}

function editSignupMessage(
  message,
  signUps,
  chestSignUps,
  oneChesterAmount,
  roster,
  tankEmote,
  healerEmote,
  dpsEmote,
  subEmote,
  chestEmote
) {
  let tanksRosterMessage = [];
  let healerRosterMessage = [];
  let dpsRosterMessage = [];
  let subRosterMessage = [];

  for (let tank of roster.tanks) {
    tanksRosterMessage.push(` <@${tank[0]}>`);
  }
  for (let healer of roster.healers) {
    healerRosterMessage.push(` <@${healer[0]}>`);
  }
  for (let dps of roster.dps) {
    dpsRosterMessage.push(` <@${dps[0]}>`);
  }
  for (let sub of roster.subs) {
    subRosterMessage.push(` <@${sub[0]}> ${[...sub[1][0]].join(" ")}`);
  }

  let edittedChestMessage = ``;
  let edittedMessage = `**- Roster -**\n${tankEmote} - ${tanksRosterMessage.join(
    ""
  )}\n${healerEmote} - ${healerRosterMessage.join(
    ""
  )}\n${dpsEmote} - ${dpsRosterMessage.join(
    ""
  )}\n${subEmote} - ${subRosterMessage}\n\n**- Signups -** ${Array.from(
    signUps.entries(),
    ([k, v]) =>
      `\n<@${k}> - ${[...v[0]].join(" ")} -  <t:${Math.floor(v[1] / 1000)}:R>`
  ).join(" ")}\n`;

  if (oneChesterAmount) {
    edittedChestMessage = `\n**- Signups w/ ${chestEmote} -** ${Array.from(
      chestSignUps.entries(),
      ([k, v]) =>
        `\n<@${k}> - ${[...v[0]].join(" ")} -  <t:${Math.floor(v[1] / 1000)}:R>`
    ).join(" ")}`;
  }
  edittedMessage += edittedChestMessage;
  message.edit(`${edittedMessage}`);
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-sale")
    .setDescription("Creates a Sale Thread for Raiders to Signup")
    .addMentionableOption((option) =>
      option
        .setName("raiders_role")
        .setDescription("The raider role that you'd want to ping")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("The content of the Sale")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("tanks")
        .setDescription("The Amount of Tanks in the sale")
        .setMinValue(0)
        .setMaxValue(8)
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("healers")
        .setDescription("The Amount of Healers in the sale")
        .setMinValue(0)
        .setMaxValue(8)
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("dps")
        .setDescription("The Amount of DPS in the sale")
        .setMinValue(0)
        .setMaxValue(8)
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
    .addIntegerOption((option) =>
      option
        .setName("chests")
        .setDescription(
          "If this sale is a one chest input how many people with chest is needed (1 - 7)"
        )
        .setMinValue(1)
        .setMaxValue(7)
    )
    .addStringOption((option) =>
      option
        .setName("scheduler_prio")
        .setDescription(
          "If you are participating as a scheduler input the role you'll be playing (T, H, or D)"
        )
    )
    .addUserOption((option) =>
      option
        .setName("client_id")
        .setDescription(
          "The client mentioned. right click user and copy ID. (Template: '<@discord_id>)'"
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("total_gil")
        .setDescription("The total amount of gil this sale is going for")
        .setMinValue(1)
    ),
  async execute(interaction, client) {
    if (interaction.member._roles.indexOf(process.env.SCHEDULER_ID) === -1) {
      await interaction.reply({
        content: ` <@${interaction.member.user.id}> You do not have access to this command`,
        ephemeral: true,
      });
      return;
    }
    let signUps = new Map();
    let chestSignUps = new Map();
    let roster = { tanks: [], healers: [], dps: [], subs: [] };
    let hourReminder = false;
    let chesterPrio = false;
    const milliSec = 60000; // how many milliseconds in a minute
    const raiderRole = interaction.options.getMentionable("raiders_role");
    const content = interaction.options.getString("content");
    const schedulerPrivledge = interaction.options.getString("scheduler_prio");
    const oneChesterAmount = interaction.options.getInteger("chests");
    const comp = {
      tankSize: interaction.options.getInteger("tanks"),
      healerSize: interaction.options.getInteger("healers"),
      dpsSize: interaction.options.getInteger("dps"),
      chestSize: oneChesterAmount ? oneChesterAmount : 0,
    }; 
    const clientId = !interaction.options.getUser("client_id")
      ? "Not Setup Yet"
      : interaction.options.getUser("client_id");
    const totalGil = interaction.options.getInteger("total_gil")
      ? interaction.options.getInteger("total_gil")
      : 0;
    const saleDate =
      interaction.options.getString("date").toUpperCase() === "ASAP"
        ? Date.now() + 30 * milliSec
        : Date.parse(interaction.options.getString("date"));

    // These Emotes have to be in the server with the specific names
    const tankEmote = client.emojis.cache.find((emoji) => emoji.name == "tank");
    const healerEmote = client.emojis.cache.find(
      (emoji) => emoji.name == "healer"
    );
    const dpsEmote = client.emojis.cache.find((emoji) => emoji.name == "dps");
    const subEmote = client.emojis.cache.find((emoji) => emoji.name == "sub");
    const chestEmote = client.emojis.cache.find(
      (emoji) => emoji.name == "chester"
    );

    // Input Validation

    // A role must be pinged
    if (raiderRole.user) {
      await interaction.reply({
        content: `You need to mention a role not a user`,
        ephemeral: true,
      });
      return;
    }

    // Cannot Have a sale with 0 people
    if (comp.tankSize + comp.healerSize + comp.dpsSize === 0) {
      await interaction.reply({
        content: `There cannot be 0 people in a sale, please have at least 1 raider in a role (\`T/H/D\`)`,
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

    // No hour reminder if there's an asap sale or the sales within the hour
    if (
      interaction.options.getString("date").toUpperCase() === "ASAP" ||
      saleDate - Date.now() < 60 * milliSec
    ) {
      hourReminder = true;
    }

    // Checks if schedulers have priority (1 Role for now)
    if (schedulerPrivledge) {
      if (
        schedulerPrivledge.toLowerCase() === "t" ||
        schedulerPrivledge.toLowerCase() === "tank"
      ) {
        setValue(
          signUps,
          interaction.member.id,
          tankEmote,
          chestEmote,
          chesterPrio
        );
      } else if (
        schedulerPrivledge.toLowerCase() === "h" ||
        schedulerPrivledge.toLowerCase() === "healer"
      ) {
        setValue(
          signUps,
          interaction.member.id,
          healerEmote,
          chestEmote,
          chesterPrio
        );
      } else if (
        schedulerPrivledge.toLowerCase() === "d" ||
        schedulerPrivledge.toLowerCase() === "dps"
      ) {
        setValue(
          signUps,
          interaction.member.id,
          dpsEmote,
          chestEmote,
          chesterPrio
        );
      } else {
        await interaction.reply({
          content: `Incorrect Scheduler privledge role. \`(T/H/D)\``,
          ephemeral: true,
        });
        return;
      }
    }

    // Clean Thread Titles
    const formattedDate =
      interaction.options.getString("date").toUpperCase() === "ASAP"
        ? "ASAP"
        : new Date(saleDate).toLocaleDateString("en-us", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZone: "America/New_York",
            timeZoneName: "short",
            hour12: true,
          });

    const saleThread = await interaction.channel.threads.create({
      name: `${formattedDate} - ${content}`,
    });
    
    const saleProfile = await client.createThreadSale(
      interaction.member,
      content,
      new Date(saleDate),
      totalGil,
      clientId.id ? clientId.id : clientId,
      saleThread,
      saleThread.url
    );
    await interaction.reply({
      content: `Sale Has been Created!\nSale ID: ||\`${saleProfile._id}\`|| (Update/Delete Sale)`,
      ephemeral: true,
    });
    const threadHeader = await saleThread.send({
      content: `<@&${
        raiderRole.id
      }>\nContent: **${content}**\nDate: <t:${Math.floor(
        saleDate / 1000
      )}:F> - <t:${Math.floor(saleDate / 1000)}:R>\nComp: **${
        comp.tankSize
      } ${tankEmote} ${comp.healerSize} ${healerEmote} ${
        comp.dpsSize
      } ${dpsEmote} ${
        comp.chestSize
      } ${chestEmote}**\nClient: ${clientId}\nSale Scheduler: <@${
        interaction.member.id
      }>\n`,
    });
    const signUpMessage = await saleThread.send({
      content: `**- Roster -**\n${tankEmote} -\n${healerEmote} -\n${dpsEmote} -\n${subEmote} - \n\n**- Signups -**`,
      fetchReply: true,
    });
    let signUpChestMessage = null;
    await signUpMessage.react(tankEmote);
    await signUpMessage.react(healerEmote);
    await signUpMessage.react(dpsEmote);

    if (schedulerPrivledge) {
      roster = updateRoster(
        signUps,
        chestSignUps,
        comp,
        tankEmote,
        healerEmote,
        dpsEmote
      );
      editSignupMessage(
        signUpMessage,
        signUps,
        chestSignUps,
        oneChesterAmount,
        roster,
        tankEmote,
        healerEmote,
        dpsEmote,
        subEmote,
        chestEmote
      );
    }
    const filter = (reaction, user) =>
      ["tank", "healer", "dps"].includes(reaction.emoji.name) && !user.bot;
    // Makes Roster Chest Prio

    if (oneChesterAmount) {
      signUpChestMessage = await saleThread.send({
        content: `**- React Here for Chester Signups -**`,
        fetchReply: true,
      });
      await signUpChestMessage.react(tankEmote);
      await signUpChestMessage.react(healerEmote);
      await signUpChestMessage.react(dpsEmote);

      const signUpChestCollector = signUpChestMessage.createReactionCollector({
        filter,
        dispose: true,
        time: saleDate - Date.now(),
      });

      signUpChestCollector.on("collect", (reaction, user) => {
        chesterPrio = true;
        setValue(
          chestSignUps,
          user.id,
          reaction.emoji,
          chestEmote,
          chesterPrio
        );
        roster = updateRoster(
          signUps,
          chestSignUps,
          comp,
          tankEmote,
          healerEmote,
          dpsEmote
        );
        editSignupMessage(
          signUpMessage,
          signUps,
          chestSignUps,
          oneChesterAmount,
          roster,
          tankEmote,
          healerEmote,
          dpsEmote,
          subEmote,
          chestEmote
        );
      });

      signUpChestCollector.on("remove", (reaction, user) => {
        removeValue(chestSignUps, user.id, reaction.emoji);
        if (chestSignUps.get(user.id)[0].size == 1) {
          chestSignUps.delete(user.id);
        }
        roster = updateRoster(
          signUps,
          chestSignUps,
          comp,
          tankEmote,
          healerEmote,
          dpsEmote
        );
        editSignupMessage(
          signUpMessage,
          signUps,
          chestSignUps,
          oneChesterAmount,
          roster,
          tankEmote,
          healerEmote,
          dpsEmote,
          subEmote,
          chestEmote
        );
      });

      signUpChestCollector.on("end", async (collected) => {
        if (!saleThread.locked) { 
            client.addCurrentRosterToSale(
              interaction.member,
              saleProfile._id,
              roster
            );
            signUpChestCollector.stop();
        }
      });
    }
    await threadHeader.pin();
    await signUpMessage.pin();
    const collector = signUpMessage.createReactionCollector({
      filter,
      dispose: true,
      time: saleDate - Date.now(),
    });

    collector.on("collect", (reaction, user) => {
      chesterPrio = false;
      setValue(signUps, user.id, reaction.emoji, chestEmote, chesterPrio);
      roster = updateRoster(
        signUps,
        chestSignUps,
        comp,
        tankEmote,
        healerEmote,
        dpsEmote
      );
      editSignupMessage(
        signUpMessage,
        signUps,
        chestSignUps,
        oneChesterAmount,
        roster,
        tankEmote,
        healerEmote,
        dpsEmote,
        subEmote,
        chestEmote
      );
    });

    collector.on("remove", (reaction, user) => {
      removeValue(signUps, user.id, reaction.emoji);
      if (signUps.get(user.id)[0].size == 0) {
        signUps.delete(user.id);
      }
      roster = updateRoster(
        signUps,
        chestSignUps,
        comp,
        tankEmote,
        healerEmote,
        dpsEmote
      );
      editSignupMessage(
        signUpMessage,
        signUps,
        chestSignUps,
        oneChesterAmount,
        roster,
        tankEmote,
        healerEmote,
        dpsEmote,
        subEmote,
        chestEmote
      );
    });

    collector.on("end", async (collected) => {
      if (!saleThread.locked) {
        await saleThread.send({
          content: `Sign Ups have been closed and the current Roster is locked into the sale\nSale ID: ||\`${saleProfile._id}\`||`,
        });
        client.addCurrentRosterToSale(
          interaction.member,
          saleProfile._id,
          roster
        );
        collector.stop();
      }
    });

    if (!hourReminder) {
      setTimeout(async function () {
        let reminderList = [];
        for (let tank of roster.tanks) {
          reminderList.push(`<@${tank[0]}> `);
        }
        for (let healer of roster.healers) {
          reminderList.push(`<@${healer[0]}> `);
        }
        for (let dps of roster.dps) {
          reminderList.push(`<@${dps[0]}> `);
        }
        const reminderMsg = await saleThread.send({
          content: `**- Reminder Ping -**\nSale is **<t:${Math.floor(
            saleDate / 1000
          )}:R>**\n${reminderList.join("")}\nReact to this by **<t:${Math.floor(
            (saleDate - 15 * milliSec) / 1000
          )}:t>** or you'll be replaced`,
        });
        reminderMsg.pin();
      }, saleDate - Date.now() - 60 * milliSec);
    }
  },
};
