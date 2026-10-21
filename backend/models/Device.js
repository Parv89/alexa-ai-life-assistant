import mongoose from 'mongoose';

const DeviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['light', 'thermostat', 'lock', 'plug', 'speaker', 'ac'],
      required: true,
    },
    room: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'standby'],
      default: 'online',
    },
    state: {
      on: { type: Boolean, default: false },
      brightness: { type: Number, min: 0, max: 100, default: 80 },
      colorTemperature: { type: Number, default: 4000 }, // Kelvin
      targetTemperature: { type: Number, default: 72 }, // Fahrenheit
      currentTemperature: { type: Number, default: 71 },
      mode: { type: String, default: 'auto' }, // cool, heat, eco, auto
      locked: { type: Boolean, default: true },
      volume: { type: Number, min: 0, max: 100, default: 45 },
      powerUsageWatts: { type: Number, default: 0 },
    },
    isSimulated: {
      type: Boolean,
      default: true,
    },
    simulationNote: {
      type: String,
      default: 'Simulated smart home endpoint. Ready for AWS IoT Core or Alexa Smart Home Skill binding.',
    },
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.models.Device || mongoose.model('Device', DeviceSchema);
export default Device;
