const Task = require('../models/Task');
const Project = require('../models/Project');

/**
 * @desc    Get tasks (filtered by project, user, status)
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res) => {
  try {
    const { project, status, priority, assignedTo, search } = req.query;
    let filter = {};

    // Members see only assigned tasks
    if (req.user.role !== 'admin') {
      filter.assignedTo = req.user.id;
    }

    if (project) filter.project = project;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo && req.user.role === 'admin') filter.assignedTo = assignedTo;
    if (search) filter.title = { $regex: search, $options: 'i' };

    // Auto-update overdue tasks
    await Task.updateMany(
      { status: { $in: ['todo', 'in-progress'] }, deadline: { $lt: new Date() } },
      { $set: { status: 'overdue' } }
    );

    const tasks = await Task.find(filter)
      .populate('project', 'name color')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort('-createdAt');

    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name color status')
      .populate('assignedTo', 'name email avatar role')
      .populate('createdBy', 'name email avatar');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Members can only see their tasks
    if (req.user.role !== 'admin' && task.assignedTo?._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create task
 * @route   POST /api/tasks
 * @access  Private/Admin
 */
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, deadline, project, assignedTo, tags } = req.body;

    // Verify project exists
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      deadline,
      project,
      assignedTo,
      tags,
      createdBy: req.user.id,
    });

    const populated = await Task.findById(task._id)
      .populate('project', 'name color')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.status(201).json({ success: true, message: 'Task created successfully', task: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update task
 * @route   PATCH /api/tasks/:id
 * @access  Private (admin: all fields, member: only status)
 */
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    let updateData = req.body;

    // Members can only update their own task status
    if (req.user.role !== 'admin') {
      if (task.assignedTo?.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      updateData = { status: req.body.status };
    }

    // If completing task, set completedAt
    if (updateData.status === 'completed' && task.status !== 'completed') {
      updateData.completedAt = new Date();
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('project', 'name color')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.json({ success: true, message: 'Task updated successfully', task: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private/Admin
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get dashboard analytics
 * @route   GET /api/tasks/analytics
 * @access  Private/Admin
 */
const getAnalytics = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
    const overdueTasks = await Task.countDocuments({ status: 'overdue' });
    const todoTasks = await Task.countDocuments({ status: 'todo' });
    const totalProjects = await Project.countDocuments();

    const recentTasks = await Task.find()
      .sort('-createdAt')
      .limit(5)
      .populate('assignedTo', 'name avatar')
      .populate('project', 'name color');

    const priorityStats = await Task.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      analytics: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        overdueTasks,
        todoTasks,
        totalProjects,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        recentTasks,
        priorityStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, getAnalytics };
