// routes/designationRoutes.js
const express = require("express");
const router = express.Router();
const {
	getAllDesignations,
	createDesignation,
	updateDesignation,
	deleteDesignation,
} = require("../controllers/designationController");

// Routes for /api/designations
router.route("/").get(getAllDesignations).post(createDesignation);

// Routes for /api/designations/:id
router.route("/:id").put(updateDesignation).delete(deleteDesignation);

module.exports = router;
