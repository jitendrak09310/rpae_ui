import axios from "axios";

import { BASE_URL } from "../utils/common";

export const getMarketDataMutualFund = async () => {
    return axios.get(`${BASE_URL}/sources/getMutualFunds?symbol=mutual_funds`);
}