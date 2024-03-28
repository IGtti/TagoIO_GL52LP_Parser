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

if(lora_payload) {
   // convert the data from Hex to Javascript Buffer
   const lora_buffer = Buffer.from(lora_payload.value, 'hex');                   // read string in bytes
   const bsize = lora_buffer.byteLength;                                         // buffer size in bytes
   var bindex;                                                                   // buffer index
   var longitude;                                                                   // sensor value
   var latitude;                                                                 // sensor channel

   payload = [];                                                                 // clean the payload array

   if(lora_payload[0] = 1) {                                                    // Message type +RSP:GTCTN: Location report in continuous mode
    
    if((lora_payload[5] & 0x80) = 0x80) {                                       // Longitude is negative
        console.log("Negative");
    } else {                                                                    // Longitude is Positive
        longitude = ((lora_payload[5] & 0xFF) << 32) + ((lora_payload[6] & 0xFF) << 16) + ((lora_payload[7] & 0xFF) << 8) + lora_payload[8];
        longitude = longitude / 1000000;
        console.log(longitude);
    }
      console.log(lora_buffer);
      svalue = lora_payload[5]+((lora_payload[6]+(lora_payload[7]/100)+(lora_payload[8]/10000))/60);

      console.log(svalue);
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