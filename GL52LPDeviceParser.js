// This is a custom payload parser to be used in the LoRaWAN data for TellMee devices

// Add ignorable variables in this array.
const ignore_vars = ['time', 'packet_id', 'gateway', 'delay', 'datarate', 'modulation_bandwidth', 'modulation_type', 'modulation_type', 'modulation_coderate', 'hardware_status', 'hardware_chain',
  'hardware_tmst', 'freq', 'size', 'port', 'duplicate', 'counter_up', 'encrypted_payload', 'header_class_b', 'header_confirmed', 'header_adr', 'header_ack', 'header_adr_ack_req', 'header_version',
  'header_type', 'Status_Channel_mask_ACK', 'Status_Data_rate_ACK', 'Status_Power_ACK', 'Status_Channel_mask_ACK', 'Status_Data_rate_ACK', 'Status_Power_ACK', 'Status_Channel_mask_ACK', 'Status_Data_rate_ACK',
  'Status_Power_ACK', 'Status_RX2_Data_rate_ACK', 'Status_Channel_ACK', 'Status_RX1DRoffset_ACK', 'rx_time', 'modulation_spreading', 'hardware_channel', 'gps_alt', 'outdated', 'gps_time', 'gps_location'];

// Remove unwanted variables
payload = payload.filter(x => !ignore_vars.includes(x.variable));

// Find the Payload
//var lora_snr = payload.find(data => data.variable === "hardware_snr");           // SNR
//if(lora_snr) lora_snr = lora_snr.value;

//var lora_rssi = payload.find(data => data.variable === "hardware_rssi");         // RSSI
//if(lora_rssi) lora_rssi = lora_rssi.value;

//var lora_gtw_location = payload.find(data => data.variable === "gps_location");  // Gateway location
//if(lora_gtw_location) lora_gtw_location = lora_gtw_location.location;

const lora_payload = payload.find(data => data.variable === "payload");          // Data payload

if (lora_payload) {
  // convert the data from Hex to Javascript Buffer
  const lora_buffer = Buffer.from(lora_payload.value, 'hex');                   // read string in bytes
  const FixType = (lora_buffer[9] & 0x60) >> 5;                                 // <Fix Type>: Bit5-Bit6 of the 4th byte indicate Fix Type
  var longitude;                                                                // Longitude
  var latitude;                                                                 // Latitude

  payload = [];                                                                 // clean the payload array

  if (lora_buffer[0] == 0x01) {                                                 // Message type +RSP:GTCTN: Location report in continuous mode
    if ((FixType == 1) || (FixType == 2)) {                                     // <Fix Type>: 1 for 2D or 2 for 3D
  //    if ((lora_buffer[5] & 0x80) == 0x80) {                                    // Longitude is negative
        longitude = ((lora_buffer[5] & 0xFF) << 24) + ((lora_buffer[6] & 0xFF) << 16) + ((lora_buffer[7] & 0xFF) << 8) + lora_buffer[8];         // Convert 4 bytes to signed integer
        longitude = longitude / 1000000;                                        // 6 implicit decimals
        console.log(longitude);
  //    } 
      
//      else {                                                                  // Longitude is Positive
//        longitude = ((lora_buffer[5] & 0xFF) << 24) + ((lora_buffer[6] & 0xFF) << 16) + ((lora_buffer[7] & 0xFF) << 8) + lora_buffer[8];         // Inverts all the bits
//        longitude = longitude / 1000000;                                        // 6 implicit decimals
//        console.log(longitude);
//      }
    }
  }



  //  payload.push({"variable": "lora_snr", "value": lora_snr});                    // build the decoded payload
  //  payload.push({"variable": "lora_rssi", "value": lora_rssi});                  // build the decoded payload
  //  payload.push({"variable": "gnss_location", "location": lora_gtw_location});    // build the decoded payload

  //  for(bindex = 0; bindex < bsize; ) {
  //     schannel = lora_buffer[bindex++];                                          // get sensor channel
  //     stype = lora_buffer[bindex++];                                             // get sensor type

  //      switch(stype) {
  //         case 0x00:                                                              // Digital Input
  //            svalue = lora_buffer[bindex++] & 0xFF;                               // get the sensor value
  //            payload.push({"variable": "digin" + (("00"+schannel).slice(-2)), "value": svalue});     // build the decoded payload
  //            break;

  //         case 0x02:                                                              // Analog input (signed value)
  //            svalue = (lora_buffer[bindex++] << 8 | lora_buffer[bindex++]) & 0xFFFF;         // get the sensor value
  //            if(svalue > 0x7FFF) svalue = svalue - 0x10000;                       // manage negative value
  //            svalue = svalue / 100;                                               // resolution 0.01
  //            payload.push({"variable": "anain" + (("00"+schannel).slice(-2)), "value": svalue});      // build the decoded payload
  //            break;

  //         case 0x67:                                                              // Temperature Sensor (signed value)
  //            svalue = (lora_buffer[bindex++] << 8 | lora_buffer[bindex++]) & 0xFFFF;         // get the sensor value
  //            if(svalue > 0x7FFF) svalue = svalue - 0x10000;                       // manage negative value
  //            svalue = svalue / 10;                                                // resolution 0.1
  //            payload.push({"variable": "temp" + (("00"+schannel).slice(-2)), "value": svalue});      // build the decoded payload
  //           break;

  //         case 0x68:                                                              // Humidity Sensor
  //            svalue = lora_buffer[bindex++] & 0xFF;                               // get the sensor value
  //            svalue = svalue / 2;                                                 // resolution 0.5
  //            payload.push({"variable": "hmdt" + (("00"+schannel).slice(-2)), "value": svalue});      // build the decoded payload
  //            break;

  //         case 0x73:                                                              // Barometer, used for Percentage (Level Input)
  //            svalue = (lora_buffer[bindex++] << 8 | lora_buffer[bindex++]) & 0xFFFF;         // get the sensor value
  //            svalue = svalue / 10;                                                // resolution 0.1
  //            payload.push({"variable": "level" + (("00"+schannel).slice(-2)), "value": svalue});     // build the decoded payload
  //            break;

  //         default:                                                                // Sensor type not found
  //            payload.push({"variable": "error", "value": schannel});              // Output "error" and channel  
  //      }
  //   }
}