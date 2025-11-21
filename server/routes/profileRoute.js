import express from "express";
import Profile from "../models/profileModel.js";
import Event from "../models/eventModel.js";

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
        const profiles = await Profile.find({ name: { $regex: req.query.name || "", $options: "i" } }).limit(5);
        res.status(200).json({status: true, message: "Profiles fetched successfully", profiles });
    } catch (error) {
        console.log(error);
        res.status(500).json({status: false, message: "Error fetching profiles", error });
    }
})

router.get("/events/:profileId", async (req, res) => {
    try {
        const events = await Event.find({ profiles: req.params.profileId }).populate('profiles','name');
        res.status(200).json({status: true, message: "Events fetched successfully", events });
    } catch (error) {
        res.status(500).json({status: false, message: "Error fetching events", error });
    }
});

export default router;
