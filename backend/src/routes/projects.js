const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(protect, getProjects).post(protect, authorize('admin'), createProject);
router.route('/:id').get(protect, getProject).put(protect, authorize('admin'), updateProject).delete(protect, authorize('admin'), deleteProject);
router.route('/:id/members').post(protect, authorize('admin'), addMember);
router.route('/:id/members/:userId').delete(protect, authorize('admin'), removeMember);

module.exports = router;
