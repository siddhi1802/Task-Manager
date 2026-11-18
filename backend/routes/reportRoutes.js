const express = require("express");
const {protect, adminOnly} = require("../middlewares/authMiddleware");
const {exportTasksReport,exportUsersReport} = require("../controllers/reportController");

const router = express.Router();

router.get("/export/tasks",protect,adminOnly,exportTasksReport);   //Expport all tasks as Excel/PDF
router.get("/export/users",protect,adminOnly,exportUsersReport);   //Export user-task report

module.exports = router;