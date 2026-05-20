const mongoose = require('mongoose');

/**
 * Task Schema
 * Tasks belong to projects and are assigned to users
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'completed', 'overdue'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    deadline: {
      type: Date,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [{ type: String, trim: true }],
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Auto-mark overdue tasks
taskSchema.pre('find', function () {
  const now = new Date();
  this.model.updateMany(
    {
      status: { $in: ['todo', 'in-progress'] },
      deadline: { $lt: now },
    },
    { $set: { status: 'overdue' } }
  ).exec().catch(() => {});
});

module.exports = mongoose.model('Task', taskSchema);
