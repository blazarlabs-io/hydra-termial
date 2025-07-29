const API_BASE_URL = "http://192.168.18.4:5000";

async function queryFunds(address) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/query-funds?address=${address}`
      );
      const data = await response.json();
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

async function payMerchant(
  clientAddress,
  merchantAddress,
  amountToPay,
  txHash,
  outputIndex
) {
  return new Promise(async (resolve, reject) => {
    try {
      const payload = {
        merchant_address: merchantAddress,
        funds_utxo_ref: {
          hash: txHash,
          index: outputIndex,
        },
        amount: amountToPay * 1000000, // The amount of ADA (in Lovelace) to pay the merchant
        signature: "",
      };
      const response = await fetch(`${API_BASE_URL}/pay-merchant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...payload }),
      });
      const data = await response.json();
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  API_BASE_URL,
  queryFunds,
  payMerchant,
};
