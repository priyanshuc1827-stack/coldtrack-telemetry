const mongoose = require('mongoose');

// Batch Schema: Defines thresholds and metadata for a cold-chain batch
const BatchSchema = new mongoose.Schema({
  batchNumber: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  productName: { 
    type: String, 
    required: true,
    trim: true
  },
  minTemperature: { 
    type: Number, 
    required: true 
  },
  maxTemperature: { 
    type: Number, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 0
  },
  status: { 
    type: String, 
    enum: ['Created', 'In Transit', 'Delivered', 'Recalled'], 
    default: 'Created' 
  }
}, { timestamps: true });

// Shipment Schema: Tracks transport route, carrier, telemetry readings, and alert logs
const ShipmentSchema = new mongoose.Schema({
  shipmentNumber: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  batchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Batch', 
    required: true 
  },
  carrier: { 
    type: String, 
    required: true,
    trim: true
  },
  origin: { 
    type: String, 
    required: true,
    trim: true
  },
  destination: { 
    type: String, 
    required: true,
    trim: true
  },
  status: { 
    type: String, 
    enum: ['Pending', 'In Transit', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  currentTemperature: { 
    type: Number,
    default: null
  },
  telemetryHistory: [
    {
      temperature: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  alertLogs: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = {
  Batch: mongoose.model('Batch', BatchSchema),
  Shipment: mongoose.model('Shipment', ShipmentSchema)
};
