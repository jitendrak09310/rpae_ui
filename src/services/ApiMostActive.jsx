import axios from "axios";

import { BASE_URL } from "../utils/common";

export const getBseMostActive = async () => {
    return axios.get(`${BASE_URL}/sources/getBseMostActive?symbol=BSE_most_active`);
}