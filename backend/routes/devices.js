import express from 'express';
import { DeviceService } from '../services/storage.js';

const router = express.Router();

// GET all devices
router.get('/', async (req, res) => {
  try {
    const devices = await DeviceService.getAll();
    res.json({
      success: true,
      count: devices.length,
      isSimulated: true,
      simulationNotice: 'All endpoints are virtual smart home models ready for IoT bridge integration.',
      data: devices,
    });
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH update device state
router.patch('/:id/state', async (req, res) => {
  try {
    const updated = await DeviceService.updateState(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST trigger predefined scene
router.post('/scene/:sceneName', async (req, res) => {
  try {
    const { sceneName } = req.params;
    const devices = await DeviceService.activateScene(sceneName);
    res.json({
      success: true,
      message: `Scene "${sceneName}" activated successfully across simulated devices`,
      data: devices,
    });
  } catch (error) {
    console.error('Error activating scene:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
