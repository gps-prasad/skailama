import express from "express";
import Event from "../models/eventModel.js";
import Logs from "../models/logsModel.js";

const router = express.Router();

router.get("/event/:eventId", async (req, res) => {
    try {
        const eventId = req.params.eventId;
        if (!eventId) {
            return res.status(400).json({status: false, message: "Event ID is required" });
        }
        const event = await Event.findById(eventId).populate('profiles','name');
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
            if (key === "profiles" && Array.isArray(updates[key])) {
                if (event[key].length !== updates[key].length) {
                    diff.push(key);
                    continue
                }
                else {
                    for ( let i = 0; i < updates[key].length; i++) {
                        if (!event.profiles[i]._id.toString().includes(updates[key][i]._id.toString())) {
                            diff.push(key);
                            break;
                        }
                    }
                }
            } else {
                if (JSON.stringify(event[key]) !== JSON.stringify(updates[key])) {
                    diff.push(key);
                }
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
