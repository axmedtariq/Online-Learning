const Course = require('../models/course');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, instructorId } = req.body;
    
    // Note: In a real app, 'req.file' would contain your uploaded thumbnail/video
    const newCourse = new Course({
      title,
      description,
      price,
      instructor: instructorId,
      lessons: [] // Start with empty lessons
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: "Failed to create course" });
  }
};

exports.addLesson = async (req, res) => {
  const { courseId } = req.params;
  const { title, videoUrl } = req.body;

  try {
    const course = await Course.findById(courseId);
    course.lessons.push({ title, videoUrl });
    await course.save();
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Error adding lesson" });
  }
};