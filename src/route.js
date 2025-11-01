import authRoutes from "../src/routes/authRoutes.js";
import deviceRoutes from "../src/routes/deviceroute.js";
import locationRoutes from "../src/routes/locationRoutes.js";
import riskRoute from "../src/routes/riskroute.js"
import express from "express";


const app = express.Router();

app.use("/auth", authRoutes);
app.use("/device", deviceRoutes);
app.use("/location", locationRoutes);
app.use("/risk", riskRoute);


export default app
