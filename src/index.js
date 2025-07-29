const bleno = require("bleno");
const characteristics = require("./characteristics");
const sio = require("./socket");

sio.startServer();

const BlenoPrimaryService = bleno.PrimaryService;
const BlenoCharacteristic = bleno.Characteristic;

sio.io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("requestFunds", (data) => {
    console.log("Funds requested", data);

    const { Char1, Char2, Char3 } = characteristics.setupCharacteristics(data);

    bleno.on("stateChange", (state) => {
      console.log("STATE", state);
      if (state === "poweredOn") {
        bleno.startAdvertising("Hydra TERM", [characteristics.SERVICE_UUID]);
      } else {
        bleno.stopAdvertising();
      }
    });

    bleno.on("advertisingStart", (error) => {
      if (!error) {
        bleno.setServices([
          new BlenoPrimaryService({
            uuid: characteristics.SERVICE_UUID,
            characteristics: [Char1, Char2, Char3],
          }),
        ]);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
