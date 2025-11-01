import axios from "axios";
import Trace from "../models/track.js";
import Risk from "../models/riskmodel.js";

export async function getPredictionByDevice(model = "idw", k = 10) {
  try {
    // 1️⃣ Get latest trace data (latest location for a device)
    const latestTrace = await Trace.findOne().sort({ timestamp: -1 }).lean();

    if (!latestTrace) {
      console.warn("⚠️ No trace data found.");
      return;
    }

    const { latitude, longitude, deviceid } = latestTrace;

    if (latitude == null || longitude == null || !deviceid) {
      console.warn(`⚠️ Missing coordinates or device ID.`);
      return;
    }

    // 2️⃣ Call Python API for prediction
    const url = "https://ai-model-ue6w.onrender.com/predict";
    const params = { lat: latitude, lon: longitude, k, model };

    const response = await axios.get(url, { params });
    const { risk } = response.data;

    // 3️⃣ Upsert (insert or update existing record)
    const filter = { deviceid, latitude, longitude, model, k };
    const update = {
      $set: {
        risk,
        timestamp: new Date(),
      },
    };

    const options = { upsert: true, new: true }; // ✅ avoid duplicates

    const savedRecord = await Risk.findOneAndUpdate(filter, update, options);

    console.log(`✅ Risk data updated for device ${deviceid} → risk: ${risk}`);
    return savedRecord;
  } catch (error) {
    console.error(`❌ Prediction failed: ${error.message}`);
  }
}
