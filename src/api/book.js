import api from "@/api/axios";
import { ENDPOINT } from "@/common/constants";

const bookService = {
  getBook: () => api.get(ENDPOINT.GET_BOOK)
};

export default bookService;
