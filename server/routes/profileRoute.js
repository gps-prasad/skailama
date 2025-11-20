import express from "express";
import Profile from "../models/profileModel.js";

const router = express.Router();

router.post("/addProfile", async (req, res) => {
    try {
        const { name } = req.body;
        const profile = await Profile.create({ name });
        res.status(200).json({status: true, message: "New profile added", profile });
    } catch (error) {
        console.log(error);
        res.status(500).json({status: false, message: "Error adding profile", error });
    }
});

router.get("/getProfiles", async (req, res) => {
    try {
        console.log(req.query.name)
        const profiles = await Profile.find({ name: { $regex: req.query.name || "", $options: "i" } }).limit(5);
        res.status(200).json({status: true, message: "Profiles fetched successfully", profiles });
    } catch (error) {
        console.log(error);
        res.status(500).json({status: false, message: "Error fetching profiles", error });
    }
})

export default router;
