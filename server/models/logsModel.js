import mongoose from "mongoose";

const logsSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event", 
  },
  logs: [
    {
    changedAt: { type: Date, default: Date.now },
    message: { type: String }
    }
  ],
});

export default mongoose.model("Logs", logsSchema);