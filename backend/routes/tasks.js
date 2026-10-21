import express from 'express';
import { TaskService } from '../services/storage.js';

const router = express.Router();

// GET all tasks with filtering
router.get('/', async (req, res) => {
  try {
    const tasks = await TaskService.getAll(req.query);
    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create task
router.post('/', async (req, res) => {
  try {
    const { title, description, category, priority, dueDate, source } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Task title is required' });
    }

    const newTask = await TaskService.create({
      title: title.trim(),
      description,
      category,
      priority,
      dueDate,
      source: source || 'web',
    });

    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT update task
router.put('/:id', async (req, res) => {
  try {
    const updated = await TaskService.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// PATCH toggle completion
router.patch('/:id/toggle', async (req, res) => {
  try {
    const task = await TaskService.toggle(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    console.error('Error toggling task:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await TaskService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, data: deleted, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
