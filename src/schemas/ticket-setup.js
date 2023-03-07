const { Schema, model } = require("mongoose");
const ticketSetupSchema = new Schema({
  _id: Schema.Types.ObjectId,
  GuildId: String,
  Channel: String,
  Category: String,
  Transcripts: String,
  Handlers: String,
  Everyone: String,
  Buttons: [String],
  Description: String,
});

module.exports = model("TicketSetup",ticketSetupSchema,"ticket setups")
