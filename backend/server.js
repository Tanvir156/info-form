const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.json());
const path = require("path");

dotenv.config();
connectDB();

const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend's domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("api is running");
});
const DataSchema = new mongoose.Schema({
  name: String,
  isAgreed: Boolean,
  selectedSector: String,
});

const DataModel = mongoose.model("YourData", DataSchema);

app.post("/insert", async (req, res) => {
  try {
    const { name, isAgreed, selectedSector } = req.body;
    const newData = new DataModel({
      name,
      isAgreed,
      selectedSector,
    });
    await newData.save();
    res.status(200).json({ success: true, data: newData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/data", async (req, res) => {
  try {
    const results = await DataModel.find();
    res.json({ message: "Data retrieved successfully", results });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.delete("/delete/:id", async (req, res) => {
  const dataId = req.params.id;

  try {
    // Find and remove the data by ID
    const result = await DataModel.findByIdAndRemove(dataId);

    if (result) {
      res.json({ message: "Data deleted successfully" });
    } else {
      res.status(404).json({ error: "Data not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT;

const server = app.listen(PORT, console.log("Server runing in 5000"));
