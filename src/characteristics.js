const bleno = require("bleno");
const sio = require("./socket");
const txpipe = require("./services");
const SERVICE_UUID = "1d4ddcb2-279d-42e2-a95a-274352a25248";
const VALUE1_CHARACTERISTIC_UUID = "a781af9a-9a04-4422-9d78-9014497ccdc0";
const VALUE2_CHARACTERISTIC_UUID = "61b64163-35fa-438a-810c-018d1a719667";
const WRITE1_CHARACTERISTIC_UUID = "9b16159d-7c3e-4ae6-990b-0d34f22389bb";

const setupCharacteristics = (data) => {
  const BlenoPrimaryService = bleno.PrimaryService;
  const BlenoCharacteristic = bleno.Characteristic;

  // const DEVICE_NAME = "Hydra TERM";

  const value1 = Buffer.from(data.address);
  const value2 = Buffer.from(data.amount.toString()); //Buffer.from(byteArray || "0");
  const rawValue1 = data.address;
  const rawValue2 = parseInt(data.amount);

  const Char1 = new BlenoCharacteristic({
    uuid: VALUE1_CHARACTERISTIC_UUID,
    properties: ["read"],
    value: value1,
    onReadRequest: (offset, callback) => callback(this.RESULT_SUCCESS, value1),
  });

  const Char2 = new BlenoCharacteristic({
    uuid: VALUE2_CHARACTERISTIC_UUID,
    properties: ["read"],
    value: value2,
    onReadRequest: (offset, callback) => callback(this.RESULT_SUCCESS, value2),
  });

  const Char3 = new BlenoCharacteristic({
    uuid: WRITE1_CHARACTERISTIC_UUID, // New UUID
    properties: ["read", "write"],
    onWriteRequest: (data, offset, withoutResponse, callback) => {
      try {
        const clientAddress = data.toString("utf8");
        console.log("🖊️ BLE Client wrote:", clientAddress);
        txpipe
          .queryFunds(clientAddress)
          .then((res) => {
            console.log("\n\nXXXXXXXXXXXXXXXXX");
            console.log("[QUERY-FUND RES]", res);
            console.log("[CLIENT ADDRESS]", clientAddress);
            console.log("[MERCHANT ADDRESS]", rawValue1);
            console.log("[AMOUNT TO PAY]", rawValue2);
            console.log("[TX-HASH]", res.fundsInL2[0].txHash);
            console.log("[INDEX]", res.fundsInL2[0].outputIndex);
            console.log("XXXXXXXXXXXXXXXXX\n\n");
            txpipe
              .payMerchant(
                clientAddress,
                rawValue1,
                rawValue2,
                res.fundsInL2[0].txHash,
                res.fundsInL2[0].outputIndex
              )
              .then((payRes) => {
                console.log("\n\nXXXXXXXXXXXXXXXXX");
                console.log("[PAY-MERCHANT RES]", payRes);
                console.log("XXXXXXXXXXXXXXXXX\n\n");
                // Send back data to Merchant
                sio.io.emit("payed", {
                  clientAddress: clientAddress,
                  merchantAddress: data.address,
                  amount: data.amount,
                  fundsInL2: payRes,
                });
                // DONE
              })
              .catch((error) => {
                console.error(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
        callback(BlenoCharacteristic.RESULT_SUCCESS);
      } catch (error) {
        console.error("❌ Error parsing data:", error);
        callback(BlenoCharacteristic.RESULT_UNLIKELY_ERROR);
      }
    },
  });
  return { Char1, Char2, Char3 };
};

module.exports = {
  setupCharacteristics,
  SERVICE_UUID,
};
