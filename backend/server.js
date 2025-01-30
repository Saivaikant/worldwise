import express from "express";
import mongoose from "mongoose";
import cors from "cors";
const MONGO_URI =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.2";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const citySchema = new mongoose.Schema({
  cityName: String,
  country: String,
  emoji: String,
  date: Date,
  notes: String,
  position: {
    lat: String,
    lng: String,
  },
});

const City = mongoose.model("Cities", citySchema);

// Get all cities
app.get("/cities", async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cities" });
  }
});

// Get city by ID
app.get("/cities/:id", async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ message: "City not found" });
    res.json(city);
  } catch (error) {
    res.status(500).json({ message: "Error fetching city" });
  }
});

// Add a new city
app.post("/cities", async (req, res) => {
  try {
    const city = new City(req.body);
    await city.save();
    res.status(201).json(city);
  } catch (error) {
    res.status(400).json({ message: "Error adding city" });
  }
});

// Delete a city
app.delete("/cities/:id", async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    res.json({ message: "City deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting city" });
  }
});

const PORT = 4500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
