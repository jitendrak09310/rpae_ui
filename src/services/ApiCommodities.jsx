import axios from "axios";

import { BASE_URL } from "../utils/common";

export const getMarketData = async () => {
    return axios.get(`${BASE_URL}/sources/getMarketData?symbol=commodities`);
}