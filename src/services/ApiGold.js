import axios from "axios";

import { BASE_URL } from "../utils/common";

export const getPriceBySymbol = async (symbol) => {
    return axios.get(`${BASE_URL}/sources/getMetalPrices?symbol=${symbol}`);
};
