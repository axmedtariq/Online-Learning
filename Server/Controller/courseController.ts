const { Course, User, Lesson, Review, Quiz, Question } = require('../models');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail } = req.body;
    const instructorId = req.user.id;

    const newCourse = await Course.create({
      title,
      description,
      price,
      thumbnail,
      instructorId: instructorId
    });

    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { instructorId: req.user.id },
      include: [{ model: Lesson, as: 'lessons' }]
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error("Fetch Instructor Courses Error:", error);
    res.status(500).json({ message: "Error fetching your courses" });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{ model: User, as: 'instructor', attributes: ['username'] }]
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error("Fetch All Courses Error:", error);
    res.status(500).json({ message: "Error fetching courses" });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: User, as: 'instructor', attributes: ['username'] },
        { model: Lesson, as: 'lessons', attributes: { exclude: ['videoUrl'] } }
      ]
    });

    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (error) {
    console.error("Fetch Course Error:", error);
    res.status(500).json({ message: "Error fetching course" });
  }
};

exports.addLesson = async (req, res) => {
  const { courseId } = req.params;
  const { title, videoUrl, duration } = req.body;

  try {
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructorId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const lesson = await Lesson.create({
      title,
      videoUrl,
      duration,
      courseId
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error("Add Lesson Error:", error);
    res.status(500).json({ message: "Error adding lesson" });
  }
};

exports.watchCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: Lesson, as: 'lessons' },
        { model: Quiz, as: 'quizzes' }
      ]
    });
    if (!course) return res.status(404).json({ message: "Course not found" });

    const user = await User.findByPk(req.user.id, {
      include: [{ model: Course, as: 'enrolledCourses', where: { id: course.id }, required: false }]
    });

    const isEnrolled = user.enrolledCourses && user.enrolledCourses.length > 0;
    const isOwner = course.instructorId === user.id;
    const isAdmin = user.role === 'admin';

    if (!isEnrolled && !isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied." });
    }

    const numQuizzes = await Quiz.count({ where: { courseId: course.id } });
    res.status(200).json({ ...course.get(), numQuizzes });
  } catch (error) {
    console.error("Watch Course Error:", error);
    res.status(500).json({ message: "Error accessing content" });
  }
};

exports.createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const courseId = req.params.id;

  try {
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const existingReview = await Review.findOne({
      where: { courseId, userId: req.user.id }
    });

    if (existingReview) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    await Review.create({
      rating,
      comment,
      userId: req.user.id,
      courseId
    });

    // Update Average Rating
    const reviews = await Review.findAll({ where: { courseId } });
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await course.update({
      averageRating: avg,
      numReviews: reviews.length
    });

    res.status(201).json({ message: "Review added" });
  } catch (error) {
    console.error("Create Review Error:", error);
    res.status(500).json({ message: "Error adding review" });
  }
};

exports.createQuiz = async (req, res) => {
  const { courseId, questions, passingScore } = req.body;

  try {
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructorId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const quiz = await Quiz.create({
      courseId,
      passingScore
    });

    if (questions && questions.length > 0) {
      await Question.bulkCreate(questions.map(q => ({
        ...q,
        quizId: quiz.id
      })));
    }

    res.status(201).json(quiz);
  } catch (error) {
    console.error("Create Quiz Error:", error);
    res.status(500).json({ message: "Error creating quiz" });
  }
};

exports.getCourseQuizzes = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // --- SECURITY LOCK: Verify Enrollment, Ownership, or Admin ---
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Course, as: 'enrolledCourses', where: { id: courseId }, required: false }]
    });

    const isEnrolled = user.enrolledCourses && user.enrolledCourses.length > 0;
    const isOwner = course.instructorId === user.id;
    const isAdmin = user.role === 'admin';

    if (!isEnrolled && !isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied. Please enroll to view quizzes." });
    }

    const quizzes = await Quiz.findAll({
      where: { courseId },
      include: [{ model: Question, as: 'questions' }]
    });
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Fetch Quizzes Error:", error);
    res.status(500).json({ message: "Error fetching quizzes" });
  }
};