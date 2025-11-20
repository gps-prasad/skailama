import express from "express";
import Logs from "../models/logsModel.js";

const router = express.Router();

router.get("/:eventId", async (req, res) => {
    try {
        const logs = await Logs.findOne({event: req.params.eventId});
        res.status(200).json({status: true, message: "Logs fetched successfully", logs });
    } catch (error) {
        console.log(error);
        res.status(500).json({status: false, message: "Error fetching logs", error });
    }
});

export default router;
