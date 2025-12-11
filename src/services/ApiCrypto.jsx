import axios from "axios";

import { BASE_URL } from "../utils/common";

export const getCryptoCoinPrices = async () => {
  return axios.get(`${BASE_URL}/sources/getAllCryptoCoins?vs_currency=inr`);
};
