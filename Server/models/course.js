const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }, // URL from Cloudinary storing
  duration: String,
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String }, 
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lessons: [lessonSchema] // Array of lessons 
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);