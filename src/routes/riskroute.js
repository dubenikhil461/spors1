import express from "express";
import Risk from "../models/riskmodel.js";

const router = express.Router();

router.get("/calculate", async (req, res) => {
  try {
    const allRisks = await Risk.find().sort({ timestamp: -1 }).limit(50);

    return res.status(200).json({
      success: true,
      message: "✅ Risk calculation complete.",
      total: allRisks.length,
      data: allRisks,
    });
  } catch (error) {
    console.error("❌ Error during risk calculation:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
});

export default router;
