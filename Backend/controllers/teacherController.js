// controllers/teacherController.js
const pool = require("../config/db");

// @desc    Get all teachers with their designation name
// @route   GET /api/teachers
exports.getAllTeachers = async (req, res) => {
	try {
		const query = `
      SELECT t.teacher_id, t.teacher_name, t.on_leave, d.designation_id, d.designation_name
      FROM Teacher t
      LEFT JOIN Designation d ON t.designation_id = d.designation_id
      ORDER BY t.teacher_name
    `;
		const [rows] = await pool.query(query);
		res.status(200).json(rows);
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};

// @desc    Create a new teacher
// @route   POST /api/teachers
exports.createTeacher = async (req, res) => {
	try {
		const { teacher_name, designation_id, on_leave = false } = req.body;

		if (!teacher_name || !designation_id) {
			return res
				.status(400)
				.json({ message: "Please provide teacher name and designation." });
		}

		const sql =
			"INSERT INTO Teacher (teacher_name, designation_id, on_leave) VALUES (?, ?, ?)";
		const [result] = await pool.query(sql, [
			teacher_name,
			designation_id,
			on_leave,
		]);

		res
			.status(201)
			.json({ message: "Teacher created successfully", id: result.insertId });
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};

// NOTE: You can add functions for updating and deleting teachers here, following the pattern from the designationController.
