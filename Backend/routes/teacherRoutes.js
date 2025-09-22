// routes/teacherRoutes.js
const express = require("express");
const router = express.Router();
const {
	getAllTeachers,
	createTeacher,
} = require("../controllers/teacherController");

// Routes for /api/teachers
router.route("/").get(getAllTeachers).post(createTeacher);

// NOTE: Add routes for updating/deleting teachers here, e.g., router.route('/:id').put(...).delete(...)

module.exports = router;
