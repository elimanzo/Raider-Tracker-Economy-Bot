const { Schema, model } = require("mongoose");
const raiderSaleSchema = new Schema({
  _id: Schema.Types.ObjectId,
  guildId: String,
  saleType: String,
  scheduler: String,
  clientId: String,
  saleThread: { type: Schema.Types.Mixed, default: {} },
  saleThreadUrl: String,
  saleDate: {
    type: Date,
    default: new Date(),
  },
  dateSubmitted: {
    type: Date,
    default: new Date(),
  },
  raiders: {
    raiderIds: { type: [String], default: [] },
    raiderPayout: { type: [Number], default: [] },
    totalRaiders: { type: Number, default: 0 },
  },
  gilProfit: { type: Number, default: 0 },
});

module.exports = new model("RaiderSale", raiderSaleSchema, "sales");
