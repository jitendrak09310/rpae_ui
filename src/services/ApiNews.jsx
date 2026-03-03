import axios from "axios";

import { BASE_URL } from "../utils/common";

export const getNews = async () => {
    return axios.get(`${BASE_URL}/sources/getNews?symbol=news`);
}