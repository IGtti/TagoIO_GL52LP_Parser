// This is a custom payload parser to be used in the LoRaWAN data for TellMee devices

// Add ignorable variables in this array.
const ignore_vars = ['time', 'packet_id', 'gateway', 'delay', 'datarate', 'modulation_bandwidth', 'modulation_type', 'modulation_type', 'modulation_coderate', 'hardware_status', 'hardware_chain',
  'hardware_tmst', 'freq', 'size', 'port', 'duplicate', 'counter_up', 'encrypted_payload', 'header_class_b', 'header_confirmed', 'header_adr', 'header_ack', 'header_adr_ack_req', 'header_version',
  'header_type', 'Status_Channel_mask_ACK', 'Status_Data_rate_ACK', 'Status_Power_ACK', 'Status_Channel_mask_ACK', 'Status_Data_rate_ACK', 'Status_Power_ACK', 'Status_Channel_mask_ACK', 'Status_Data_rate_ACK',
  'Status_Power_ACK', 'Status_RX2_Data_rate_ACK', 'Status_Channel_ACK', 'Status_RX1DRoffset_ACK', 'rx_time', 'modulation_spreading', 'hardware_channel', 'gps_alt', 'outdated', 'gps_time', 'gps_location'];

// Remove unwanted variables
payload = payload.filter(x => !ignore_vars.includes(x.variable));

const lora_payload = payload.find(data => data.variable === "payload");          // Data payload

if (lora_payload) {
  // convert the data from Hex to Javascript Buffer
  const lora_buffer = Buffer.from(lora_payload.value, 'hex');                   // read string in bytes
  const FixType = (lora_buffer[9] & 0x60) >> 5;                                 // <Fix Type>: Bit5-Bit6 of the 4th byte indicate Fix Type
  const bsize = lora_buffer.byteLength;                                         // buffer size in bytes --> 17 for GNSS location and battery only. Not considering UTC, Altitude, Azimuth and Speed
  let longitude;                                                                // Longitude
  let latitude;                                                                 // Latitude
  let battery;                                                                  // Battery Percentage

  payload = [];                                                                 // clean the payload array

  if (((lora_buffer[0] == 0x01) || (lora_buffer[0] == 0x09) || (lora_buffer[0] == 0x02) || (lora_buffer[0] == 0x1A)) && (bsize == 17)) {       // Message type +RSP:GTCTN:, +RSP:GTSTR:, +EVT:GTNMR:, +EVT:GTRTL:
    if ((FixType == 1) || (FixType == 2)) {                                     // <Fix Type>: 1 for 2D or 2 for 3D
      longitude = ((lora_buffer[5] & 0xFF) << 24) + ((lora_buffer[6] & 0xFF) << 16) + ((lora_buffer[7] & 0xFF) << 8) + lora_buffer[8];         // Convert 4 bytes to signed integer
      longitude = longitude / 1000000;                                          // 6 implicit decimals

      latitude = ((lora_buffer[9] & 0x0F) << 24) + ((lora_buffer[10] & 0xFF) << 16) + ((lora_buffer[11] & 0xFF) << 8) + lora_buffer[12];       // Convert 3.5 bytes to integer
      latitude = latitude / 1000000;                                            // 6 implicit decimals
      if((lora_buffer[9] & 0x10) == 0x10) latitude = latitude * -1;             // Check if latitude is negative


      // Building the TagoIO payload format
      payload.push({"variable": "tracker_location", "value": latitude, "location": {"lat": latitude, "lng": longitude}});              // build the decoded payload
    }

    battery = lora_buffer[13];
    //console.log(battery);
    payload.push({"variable": "battery", "value": battery});                    // build the decoded payload
  }
}