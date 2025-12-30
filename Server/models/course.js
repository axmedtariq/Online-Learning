const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }, // URL from Cloudinary for storing cloud api
  duration: String,
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String }, 
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lessons: [lessonSchema] // Array of lessons that we use our courses lessons 
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);