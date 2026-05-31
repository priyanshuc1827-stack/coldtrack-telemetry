const BASE_URL = 'http://127.0.0.1:5001/api';

async function runTests() {
  console.log('Starting API Verification Tests...');
  let batchId = null;
  let shipmentId = null;

  try {
    // 1. Create a Batch
    console.log('\n--- Test 1: Create Batch ---');
    const batchPayload = {
      batchNumber: 'BTC-' + Math.floor(Math.random() * 10000),
      productName: 'BioShield Vaccine Alpha',
      minTemperature: 2.0,
      maxTemperature: 8.0,
      quantity: 1500,
      status: 'Created'
    };

    const createBatchRes = await fetch(`${BASE_URL}/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchPayload)
    });

    if (!createBatchRes.ok) {
      throw new Error(`Failed to create batch: ${createBatchRes.statusText}`);
    }

    const createdBatch = await createBatchRes.json();
    batchId = createdBatch._id;
    console.log('Successfully created Batch:', createdBatch);

    // 2. Get All Batches
    console.log('\n--- Test 2: Get All Batches ---');
    const getBatchesRes = await fetch(`${BASE_URL}/batches`);
    const batches = await getBatchesRes.json();
    console.log(`Retrieved ${batches.length} batches. Status OK.`);

    // 3. Create a Shipment
    console.log('\n--- Test 3: Create Shipment ---');
    const shipmentPayload = {
      shipmentNumber: 'SHP-' + Math.floor(Math.random() * 10000),
      batchId: batchId,
      carrier: 'ColdSpeed Logistics',
      origin: 'San Francisco, CA',
      destination: 'Boston, MA',
      status: 'Pending'
    };

    const createShipmentRes = await fetch(`${BASE_URL}/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shipmentPayload)
    });

    if (!createShipmentRes.ok) {
      throw new Error(`Failed to create shipment: ${createShipmentRes.statusText}`);
    }

    const createdShipment = await createShipmentRes.json();
    shipmentId = createdShipment._id;
    console.log('Successfully created Shipment:', createdShipment);

    // 4. Send Telemetry - Safe Range (5°C)
    console.log('\n--- Test 4: Send Telemetry (Safe Range: 5°C) ---');
    const telemetrySafeRes = await fetch(`${BASE_URL}/shipments/${shipmentId}/telemetry`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temperature: 5.0 })
    });

    if (!telemetrySafeRes.ok) {
      throw new Error(`Failed to send safe telemetry: ${telemetrySafeRes.statusText}`);
    }

    const updatedShipmentSafe = await telemetrySafeRes.json();
    console.log('Telemetry Response (Safe):', {
      currentTemperature: updatedShipmentSafe.currentTemperature,
      telemetryHistoryLength: updatedShipmentSafe.telemetryHistory.length,
      alertLogsLength: updatedShipmentSafe.alertLogs.length
    });

    if (updatedShipmentSafe.alertLogs.length !== 0) {
      throw new Error('Expected 0 alert logs for safe temperature, got: ' + updatedShipmentSafe.alertLogs.length);
    }

    // 5. Send Telemetry - Breach Range (12°C)
    console.log('\n--- Test 5: Send Telemetry (Breach Range: 12°C) ---');
    const telemetryBreachRes = await fetch(`${BASE_URL}/shipments/${shipmentId}/telemetry`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temperature: 12.0 })
    });

    if (!telemetryBreachRes.ok) {
      throw new Error(`Failed to send breach telemetry: ${telemetryBreachRes.statusText}`);
    }

    const updatedShipmentBreach = await telemetryBreachRes.json();
    console.log('Telemetry Response (Breach):', {
      currentTemperature: updatedShipmentBreach.currentTemperature,
      telemetryHistoryLength: updatedShipmentBreach.telemetryHistory.length,
      alertLogsLength: updatedShipmentBreach.alertLogs.length,
      latestAlert: updatedShipmentBreach.alertLogs[0]
    });

    if (updatedShipmentBreach.alertLogs.length !== 1) {
      throw new Error('Expected 1 alert log for breach temperature, got: ' + updatedShipmentBreach.alertLogs.length);
    }

    // 6. Get Single Shipment (Populated)
    console.log('\n--- Test 6: Get Single Shipment (Populated) ---');
    const getShipmentRes = await fetch(`${BASE_URL}/shipments/${shipmentId}`);
    const populatedShipment = await getShipmentRes.json();
    console.log('Populated Shipment details:', {
      id: populatedShipment._id,
      shipmentNumber: populatedShipment.shipmentNumber,
      batch: populatedShipment.batchId ? {
        batchNumber: populatedShipment.batchId.batchNumber,
        productName: populatedShipment.batchId.productName,
        minTemp: populatedShipment.batchId.minTemperature,
        maxTemp: populatedShipment.batchId.maxTemperature
      } : 'NOT_FOUND'
    });

    // 7. Cleanup
    console.log('\n--- Test 7: Cleanup (Delete Shipment and Batch) ---');
    const deleteShipmentRes = await fetch(`${BASE_URL}/shipments/${shipmentId}`, { method: 'DELETE' });
    const deleteBatchRes = await fetch(`${BASE_URL}/batches/${batchId}`, { method: 'DELETE' });

    console.log('Shipment cleanup status:', (await deleteShipmentRes.json()).message);
    console.log('Batch cleanup status:', (await deleteBatchRes.json()).message);

    console.log('\nALL TESTS PASSED SUCCESSFULLY! ✅');
  } catch (error) {
    console.error('\nTEST FAILED! ❌');
    console.error(error);
    
    // Attempt cleanup if failed midway
    if (shipmentId) {
      await fetch(`${BASE_URL}/shipments/${shipmentId}`, { method: 'DELETE' }).catch(() => {});
    }
    if (batchId) {
      await fetch(`${BASE_URL}/batches/${batchId}`, { method: 'DELETE' }).catch(() => {});
    }
    process.exit(1);
  }
}

// Wait for server startup
setTimeout(runTests, 2000);
