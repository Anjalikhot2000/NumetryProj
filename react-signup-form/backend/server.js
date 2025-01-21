require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const cloudinary = require("./cloudinaryConfig"); // Import Cloudinary config

const app = express();
const port = 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Define User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photoUrl: { type: String, required: true }, // Store the Cloudinary URL
});

const User = mongoose.model("User", userSchema);

// Middleware
app.use(
  cors({
    origin: ["https://numetry-proj.vercel.app", "http://localhost:5173"], // Add your frontend URLs
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the Numetry API!");
});

// Signup Route
app.post("/api/signup", upload.single("photo"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const photo = req.file; // This is the uploaded image file

    if (!name || !email || !password || !photo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Convert file buffer to Base64
    const photoBase64 = `data:${photo.mimetype};base64,${photo.buffer.toString("base64")}`;

    // Upload photo to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(photoBase64, {
      folder: "user_photos",
    });

    const newUser = new User({
      name,
      email,
      password,
      photoUrl: cloudinaryResponse.secure_url,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Export the app
module.exports = app;
