import express from "express";
import Event from "../models/eventModel.js";
import Logs from "../models/logsModel.js";
import Profile from "../models/profileModel.js";

const router = express.Router();

router.get("/:profileId", async (req, res) => {
    try {
        const event = await Event.find({ profiles: req.params.profileId });
        for (let i = 0; i < event.length; i++) {
            event[i].profiles = await Profile.find({ _id: { $in: event[i].profiles } });
        }
        res.status(200).json({status: true, message: "Events fetched successfully", event });
    } catch (error) {
        res.status(500).json({status: false, message: "Error fetching events", error });
    }
});

router.get("/event/:eventId", async (req, res) => {
    try {
        const eventId = req.params.eventId;
        if (!eventId) {
            return res.status(400).json({status: false, message: "Event ID is required" });
        }
        const event = await Event.findById(eventId);
        res.status(200).json({status: true, message: "Event fetched successfully", event });
    } catch (error) {
        res.status(500).json({status: false, message: "Error fetching event", error });
    }
});


router.post("/addEvent", async (req, res) => {
    try {
        const { profiles, timezone, eventStartDate, eventEndDate } = req.body;
        const event = await Event.create({ profiles, timezone, eventStartDate, eventEndDate });
        res.status(200).json({status: true, message: "New event added", event });
    } catch (error) {
        res.status(500).json({status: false, message: "Error adding event", error });
    }
});

router.post("/updateEvent", async (req, res) => {
    try {
        const event = await Event.findById(req.body._id);
        const updates = req.body;   
        const diff = [];
        for (let key in updates) {
            if (JSON.stringify(event[key]) !== JSON.stringify(updates[key])) {
                diff.push(key);
                console.log(event[key], updates[key])
            }
        }
        Object.assign(event, {...updates, updatedAt: new Date()});
        await event.save();
        await Logs.findOneAndUpdate(
            { event: event._id },
            {
                $push: {
                    logs: {
                        changedAt: new Date(),
                        message: `${diff.join(", ")} updated`,
                    }
                }
            },
            { new: true, upsert: true } 
            );
        res.status(200).json({status: true, message: "Event updated successfully", event});
    } catch (error) {
        res.status(500).json({status: false, message: "Error updating event", error });
    }
});

export default router;
