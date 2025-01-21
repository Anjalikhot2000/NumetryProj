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
    origin: [ "https://numetry-proj.vercel.app","http://localhost:5173",], // Add your frontend URLs
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Signup route
app.post("/api/signup", upload.single("photo"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const photo = req.file; // This is the uploaded image file

    // Log uploaded file for debugging
    console.log('Uploaded file:', req.file);

    // Check if all required fields are present
    if (!name || !email || !password || !photo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Convert the file buffer to a base64 string
    const photoBase64 = `data:${photo.mimetype};base64,${photo.buffer.toString("base64")}`;

    // Upload photo to Cloudinary
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(photoBase64, {
        folder: "user_photos", // optional: specify a folder in Cloudinary
      });

      console.log('Cloudinary upload successful:', cloudinaryResponse); // Log response for debugging

      const newUser = new User({
        name,
        email,
        password,
        photoUrl: cloudinaryResponse.secure_url, // Save Cloudinary URL
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully!" });
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError); // Log Cloudinary-specific errors
      return res.status(500).json({
        message: "Error uploading image to Cloudinary",
        error: cloudinaryError.message, // Send specific error message
      });
    }
  } catch (error) {
    // Log the full error to the console for debugging
    console.error("Error during signup:", error);

    // Return a more specific error message to the client
    res.status(500).json({
      message: "Internal server error",
      error: error.message, // Send the error message for debugging purposes
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
