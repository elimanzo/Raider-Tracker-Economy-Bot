const { Schema, model } = require("mongoose");
const ticketSchema = new Schema({
  _id: Schema.Types.ObjectId,
  guildId: String,
  clientUserName: String,
  clientUserId: String,
  ticketUserIds: { type: [String], default: [] },
  ticketId: String,
  channelId: String,
  Closed: Boolean,
  Locked: Boolean,
  Type: String,
  ticketDate: {
    type: Date,
    default: new Date(),
  },
  transcriptURL: {type: String, default: ''},
  Claimed: Boolean,
  scheduler: String,
});

module.exports = new model("Ticket", ticketSchema, "tickets");
