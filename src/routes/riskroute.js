import axios from "axios";
import Trace from "../models/track.js";
import Risk from "../models/riskmodel.js";

export async function getPredictionByDevice(model = "idw", k = 10) {
  try {
    // 1️⃣ Get all unique devices
    const devices = await Trace.distinct("deviceid");
    if (!devices.length) {
      console.warn("⚠️ No devices found in trace collection.");
      return;
    }

    console.log(`📡 Found ${devices.length} devices.`);

    for (const deviceid of devices) {
      // 2️⃣ Get latest trace for each device
      const latestTrace = await Trace.findOne({ deviceid })
        .sort({ timestamp: -1 })
        .lean();

      if (!latestTrace) continue;

      const { latitude, longitude } = latestTrace;
      if (latitude == null || longitude == null) continue;

      // 3️⃣ Check if this combination already exists in Risk collection
      const exists = await Risk.findOne({
        deviceid,
        latitude,
        longitude,
        model,
        k,
      });

      if (exists) {
        console.log(`⏭️ Already exists for device ${deviceid} — skipping.`);
        continue;
      }

      // 4️⃣ Get prediction from Python API
      const url = "https://ai-model-ue6w.onrender.com/predict";
      const params = { lat: latitude, lon: longitude, k, model };

      const response = await axios.get(url, { params });
      const { risk } = response.data;

      // 5️⃣ Insert new record
      const riskRecord = new Risk({
        deviceid,
        latitude,
        longitude,
        risk,
        model,
        k,
        timestamp: new Date(),
      });

      await riskRecord.save();

      console.log(`✅ Inserted new risk for device ${deviceid} → ${risk}`);
    }

    console.log("🎯 All new device risk records inserted.");
  } catch (error) {
    console.error(`❌ Prediction failed: ${error.message}`);
  }
}
