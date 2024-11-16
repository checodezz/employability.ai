import express from "express";
import { config } from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
config();
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
import connectDB from "./db/db.js";

connectDB();

app.use("/api", authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("welcome to internet");
});
