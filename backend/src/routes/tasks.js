const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getAnalytics,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.route('/').get(protect, getTasks).post(protect, authorize('admin'), createTask);
router.route('/:id').get(protect, getTask).patch(protect, updateTask).delete(protect, authorize('admin'), deleteTask);

module.exports = router;
