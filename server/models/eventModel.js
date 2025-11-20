import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  profiles: {
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile", 
    }],
    required: true,
  },
  timezone: {
    type: String,
    required: true,
  },
  eventStartDate: {
    type: Date,
    required: true,
  },
  eventEndDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Event", eventSchema);