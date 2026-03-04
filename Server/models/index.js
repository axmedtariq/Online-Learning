const sequelize = require('../config/database');
const User = require('./user');
const Course = require('./course');
const Lesson = require('./lesson');
const Review = require('./review');
const Quiz = require('./quiz');
const Question = require('./question');
const Progress = require('./progressbar');

// --- ASSOCIATIONS ---

// 1. Instructor - Course (1:M)
User.hasMany(Course, { as: 'teachingCourses', foreignKey: 'instructorId' });
Course.belongsTo(User, { as: 'instructor', foreignKey: 'instructorId' });

// 2. Student - Course Enrollment (M:M)
User.belongsToMany(Course, { through: 'Enrollments', as: 'enrolledCourses' });
Course.belongsToMany(User, { through: 'Enrollments', as: 'studentsEnrolled' });

// 3. Course - Lesson (1:M)
Course.hasMany(Lesson, { as: 'lessons', foreignKey: 'courseId', onDelete: 'CASCADE' });
Lesson.belongsTo(Course, { foreignKey: 'courseId' });

// 4. Course - Review (1:M)
Course.hasMany(Review, { as: 'courseReviews', foreignKey: 'courseId', onDelete: 'CASCADE' });
Review.belongsTo(Course, { foreignKey: 'courseId' });

// 5. User - Review (1:M)
User.hasMany(Review, { as: 'reviews', foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

// 6. Course - Quiz (1:M)
Course.hasMany(Quiz, { as: 'quizzes', foreignKey: 'courseId', onDelete: 'CASCADE' });
Quiz.belongsTo(Course, { foreignKey: 'courseId' });

// 7. Quiz - Question (1:M)
Quiz.hasMany(Question, { as: 'questions', foreignKey: 'quizId', onDelete: 'CASCADE' });
Question.belongsTo(Quiz, { foreignKey: 'quizId' });

// 8. User - Course Progress (M:M via Progress)
User.hasMany(Progress, { foreignKey: 'userId' });
Progress.belongsTo(User, { foreignKey: 'userId' });

Course.hasMany(Progress, { foreignKey: 'courseId' });
Progress.belongsTo(Course, { foreignKey: 'courseId' });

Lesson.hasMany(Progress, { foreignKey: 'lessonId' });
Progress.belongsTo(Lesson, { foreignKey: 'lessonId' });

module.exports = {
    sequelize,
    User,
    Course,
    Lesson,
    Review,
    Quiz,
    Question,
    Progress
};
