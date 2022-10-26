const { ActivityType } = require("discord.js");

module.exports = (client) => {
  client.pickPresence = async () => {
    const options = [
      {
        type: ActivityType.Watching,
        text: "Raiders wipe to mechanics",
        status: "online",
      },
      {
        type: ActivityType.Listening,
        text: "Rat Raiders",
        status: "idle",
      },
      {
        type: ActivityType.Playing,
        text: "Phasmophobia",
        status: "dnd",
      },
    ];
    const option = Math.floor(Math.random() * options.length);

    client.user.setPresence({
      activities: [
        {
          name: options[option].text,
          type: options[option].type,
        },
      ],
      status: options[option].status,
    });
  };
};
