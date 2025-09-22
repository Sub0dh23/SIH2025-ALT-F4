// controllers/designationController.js
const pool = require("../config/db");

// @desc    Get all designations
// @route   GET /api/designations
exports.getAllDesignations = async (req, res) => {
	try {
		const [rows] = await pool.query(
			"SELECT * FROM Designation ORDER BY designation_name"
		);
		res.status(200).json(rows);
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};

// @desc    Create a new designation
// @route   POST /api/designations
exports.createDesignation = async (req, res) => {
	try {
		const { designation_name, max_hours_per_week } = req.body;
		if (!designation_name || max_hours_per_week === undefined) {
			return res
				.status(400)
				.json({ message: "Please provide a name and max hours." });
		}

		const sql =
			"INSERT INTO Designation (designation_name, max_hours_per_week) VALUES (?, ?)";
		const [result] = await pool.query(sql, [
			designation_name,
			max_hours_per_week,
		]);

		res
			.status(201)
			.json({
				message: "Designation created successfully",
				id: result.insertId,
			});
	} catch (error) {
		if (error.code === "ER_DUP_ENTRY") {
			return res
				.status(409)
				.json({ message: "This designation name already exists." });
		}
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};

// @desc    Update a designation
// @route   PUT /api/designations/:id
exports.updateDesignation = async (req, res) => {
	try {
		const { designation_name, max_hours_per_week } = req.body;
		const { id } = req.params;

		const sql =
			"UPDATE Designation SET designation_name = ?, max_hours_per_week = ? WHERE designation_id = ?";
		const [result] = await pool.query(sql, [
			designation_name,
			max_hours_per_week,
			id,
		]);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Designation not found." });
		}

		res.status(200).json({ message: "Designation updated successfully" });
	} catch (error) {
		if (error.code === "ER_DUP_ENTRY") {
			return res
				.status(409)
				.json({ message: "This designation name already exists." });
		}
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};

// @desc    Delete a designation
// @route   DELETE /api/designations/:id
exports.deleteDesignation = async (req, res) => {
	try {
		const { id } = req.params;
		const [result] = await pool.query(
			"DELETE FROM Designation WHERE designation_id = ?",
			[id]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: "Designation not found." });
		}

		res.status(200).json({ message: "Designation deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};
