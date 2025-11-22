import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import Events from "./routes/eventRoute.js";
import Profile from "./routes/profileRoute.js";
import Logs from "./routes/logsRoute.js";

dotenv.config();

connectDB();

const port = 3001;
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.use(express.json());

app.use('/api/profiles', Profile);
app.use('/api/events', Events);
app.use('/api/logs', Logs);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});