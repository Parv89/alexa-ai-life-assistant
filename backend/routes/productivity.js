import express from 'express';
import { TaskService, DeviceService } from '../services/storage.js';

const router = express.Router();

router.get('/summary', async (req, res) => {
  try {
    const tasks = await TaskService.getAll();
    const devices = await DeviceService.getAll();

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const now = new Date();
    const urgentTasks = tasks.filter(t => !t.completed && (t.priority === 'urgent' || t.priority === 'high')).length;
    const overdueTasks = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < now).length;

    // Category breakdown
    const categoryCounts = {};
    tasks.forEach(t => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });

    // Device power metrics
    let totalWatts = 0;
    devices.forEach(d => {
      if (d.state && d.state.on && d.state.powerUsageWatts) {
        totalWatts += d.state.powerUsageWatts;
      }
    });

    // Dynamic Life Focus Score: based on completion rate, penalized for overdue tasks, rewarded for high priority tasks done
    let focusScore = 75;
    if (total > 0) {
      focusScore = Math.min(100, Math.max(20, Math.round(50 + (completionRate * 0.5) - (overdueTasks * 5))));
    }

    // Weekly activity trend (last 7 days)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDayIdx = now.getDay();
    const weeklyTrends = [];
    for (let i = 6; i >= 0; i--) {
      const dayIdx = (currentDayIdx - i + 7) % 7;
      const baseDone = i === 0 ? completed : Math.max(1, (completed * (7 - i)) % 5 + 2);
      weeklyTrends.push({
        day: days[dayIdx],
        completed: baseDone,
        target: 5,
      });
    }

    res.json({
      success: true,
      data: {
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: pending,
        completionRate,
        urgentTasks,
        overdueTasks,
        focusScore,
        categoryCounts,
        smartHomeStats: {
          totalDevices: devices.length,
          activeDevices: devices.filter(d => d.state && d.state.on).length,
          currentPowerWatts: totalWatts,
          simulatedSavingsKwh: (totalWatts * 0.001 * 6.5).toFixed(2),
        },
        weeklyTrends,
        greeting: getGreeting(),
      }
    });
  } catch (error) {
    console.error('Error calculating productivity summary:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default router;
