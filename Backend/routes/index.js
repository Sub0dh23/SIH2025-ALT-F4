
// routes/index.js
const express = require('express');
const router = express.Router();

const designationRoutes = require('./designationRoutes');
const teacherRoutes = require('./teacherRoutes');

// Use the imported routes and prefix them
router.use('/designations', designationRoutes);
router.use('/teachers', teacherRoutes);
// You will add other routes here, e.g., router.use('/subjects', subjectRoutes);

module.exports = router;