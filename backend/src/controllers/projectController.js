const Project = require('../models/Project');
const Task = require('../models/Task');

/**
 * @desc    Get all projects (admin: all, member: assigned)
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = async (req, res) => {
  try {
    let query;
    if (req.user.role === 'admin') {
      query = Project.find();
    } else {
      query = Project.find({ members: req.user.id });
    }

    const projects = await query
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar role')
      .sort('-createdAt');

    // Add task progress to each project
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({ project: project._id });
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === 'completed').length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { ...project.toObject(), taskCount: total, progress };
      })
    );

    res.json({ success: true, count: projectsWithProgress.length, projects: projectsWithProgress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single project
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check access for members
    if (req.user.role !== 'admin' && !project.members.some((m) => m._id.toString() === req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const tasks = await Task.find({ project: project._id });
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      success: true,
      project: { ...project.toObject(), taskCount: total, progress },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create project
 * @route   POST /api/projects
 * @access  Private/Admin
 */
const createProject = async (req, res) => {
  try {
    const { name, description, status, priority, deadline, members, color } = req.body;

    const project = await Project.create({
      name,
      description,
      status,
      priority,
      deadline,
      color,
      owner: req.user.id,
      members: members || [],
    });

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar role');

    res.status(201).json({ success: true, message: 'Project created successfully', project: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private/Admin
 */
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar role');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, message: 'Project updated successfully', project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private/Admin
 */
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Delete associated tasks
    await Task.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Project and associated tasks deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Add member to project
 * @route   POST /api/projects/:id/members
 * @access  Private/Admin
 */
const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ success: false, message: 'User already a member' });
    }

    project.members.push(userId);
    await project.save();

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar role');

    res.json({ success: true, message: 'Member added successfully', project: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Remove member from project
 * @route   DELETE /api/projects/:id/members/:userId
 * @access  Private/Admin
 */
const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.members = project.members.filter((m) => m.toString() !== req.params.userId);
    await project.save();

    res.json({ success: true, message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, addMember, removeMember };
