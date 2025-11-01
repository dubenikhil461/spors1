import mongoose from "mongoose";

const riskschema = new mongoose.Schema({
  deviceid: { type: String, required: true },
  latitude: Number,
  risk :Number,
  longitude: Number,
  k: Number,
  model: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Risk", riskschema);
