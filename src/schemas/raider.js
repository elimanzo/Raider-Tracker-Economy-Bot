const { Schema, model } = require("mongoose");
const raiderSchema = new Schema({
  _id: Schema.Types.ObjectId,
  guildId: String,
  userName: String,
  userId: String,
  server: String,
  houseAddress: String,
  lastSale: {
    type: Date,
    default: new Date(),
  },
  joinedDate: {
    type: Date,
    default: new Date(),
  },
  gilProfit: { type: Number, default: 0 },
  sales: { type: [String], default: [] },
  isRetired: { type: Boolean, default: false }
});

module.exports = new model("Raider", raiderSchema, "raiders");
