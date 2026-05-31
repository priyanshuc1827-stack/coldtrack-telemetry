const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { Batch, Shipment } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coldtrack';

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// ==========================================
// BATCH CRUD ROUTES
// ==========================================

// Create a new Batch
app.post('/api/batches', async (req, res) => {
  try {
    const { batchNumber, productName, minTemperature, maxTemperature, quantity, status } = req.body;
    const newBatch = new Batch({ batchNumber, productName, minTemperature, maxTemperature, quantity, status });
    const savedBatch = await newBatch.save();
    res.status(201).json(savedBatch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Batches
app.get('/api/batches', async (req, res) => {
  try {
    const batches = await Batch.find({});
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single Batch by ID
app.get('/api/batches/:id', async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id);
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found.' });
    }
    res.json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Batch by ID
app.put('/api/batches/:id', async (req, res) => {
  try {
    const updatedBatch = await Batch.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBatch) {
      return res.status(404).json({ error: 'Batch not found.' });
    }
    res.json(updatedBatch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a Batch by ID
app.delete('/api/batches/:id', async (req, res) => {
  try {
    const deletedBatch = await Batch.findByIdAndDelete(req.params.id);
    if (!deletedBatch) {
      return res.status(404).json({ error: 'Batch not found.' });
    }
    res.json({ message: 'Batch deleted successfully.', batch: deletedBatch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// SHIPMENT CRUD ROUTES
// ==========================================

// Create a new Shipment
app.post('/api/shipments', async (req, res) => {
  try {
    const { shipmentNumber, batchId, carrier, origin, destination, status } = req.body;
    
    // Validate Batch exists
    const batchExists = await Batch.findById(batchId);
    if (!batchExists) {
      return res.status(400).json({ error: 'Associated Batch does not exist.' });
    }

    const newShipment = new Shipment({ shipmentNumber, batchId, carrier, origin, destination, status });
    const savedShipment = await newShipment.save();
    res.status(201).json(savedShipment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Shipments
app.get('/api/shipments', async (req, res) => {
  try {
    const shipments = await Shipment.find({}).populate('batchId');
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single Shipment by ID
app.get('/api/shipments/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id).populate('batchId');
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found.' });
    }
    res.json(shipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Shipment by ID
app.put('/api/shipments/:id', async (req, res) => {
  try {
    const { batchId } = req.body;
    if (batchId) {
      const batchExists = await Batch.findById(batchId);
      if (!batchExists) {
        return res.status(400).json({ error: 'Associated Batch does not exist.' });
      }
    }

    const updatedShipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('batchId');

    if (!updatedShipment) {
      return res.status(404).json({ error: 'Shipment not found.' });
    }
    res.json(updatedShipment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a Shipment by ID
app.delete('/api/shipments/:id', async (req, res) => {
  try {
    const deletedShipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!deletedShipment) {
      return res.status(404).json({ error: 'Shipment not found.' });
    }
    res.json({ message: 'Shipment deleted successfully.', shipment: deletedShipment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// TELEMETRY SIMULATION ENDPOINT
// ==========================================

// PUT /api/shipments/:id/telemetry
// Receives a new temperature reading, logs it, and creates warning alerts if thresholds breached.
app.put('/api/shipments/:id/telemetry', async (req, res) => {
  try {
    const { temperature } = req.body;
    if (temperature === undefined || typeof temperature !== 'number') {
      return res.status(400).json({ error: 'temperature field is required and must be a number.' });
    }

    // Find the shipment and populate the associated Batch thresholds
    const shipment = await Shipment.findById(req.params.id).populate('batchId');
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found.' });
    }

    const batch = shipment.batchId;
    if (!batch) {
      return res.status(400).json({ error: 'Associated Batch details not found for this shipment.' });
    }

    // Update current temperature and push to telemetryHistory
    shipment.currentTemperature = temperature;
    shipment.telemetryHistory.push({ temperature, timestamp: new Date() });

    // Evaluate temperature thresholds
    const isUnderTemp = temperature < batch.minTemperature;
    const isOverTemp = temperature > batch.maxTemperature;

    if (isUnderTemp || isOverTemp) {
      let warningString = '';
      const timestampString = new Date().toISOString();
      if (isUnderTemp) {
        warningString = `[${timestampString}] WARNING: Temperature breach detected. Current reading (${temperature}°C) is below the minimum threshold of ${batch.minTemperature}°C for Batch ${batch.batchNumber} (${batch.productName}).`;
      } else {
        warningString = `[${timestampString}] WARNING: Temperature breach detected. Current reading (${temperature}°C) is above the maximum threshold of ${batch.maxTemperature}°C for Batch ${batch.batchNumber} (${batch.productName}).`;
      }
      
      // Append warning string to alertLogs
      shipment.alertLogs.push(warningString);
    }

    const updatedShipment = await shipment.save();
    res.json(updatedShipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`ColdTrack server is running on port ${PORT}`);
});
