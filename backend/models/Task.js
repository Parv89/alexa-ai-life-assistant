import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['Work', 'Personal', 'Health', 'Home', 'Learning', 'Productivity'],
      default: 'Personal',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Default tomorrow
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    source: {
      type: String,
      enum: ['web', 'voice', 'alexa', 'system'],
      default: 'web',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for human-readable deadline status
TaskSchema.virtual('isOverdue').get(function () {
  if (this.completed) return false;
  return this.dueDate && new Date() > this.dueDate;
});

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);
export default Task;
