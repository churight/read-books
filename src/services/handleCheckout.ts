import axios from "axios";
import IBook from "../interfaces/IBook";

interface CheckoutResult {
  message: string;
  clearedBooks: IBook[];
}

export const handleCheckout = async (): Promise<CheckoutResult> => {
  try {
    const res = await axios.post(`http://localhost:4000/api/browse/cart/checkout`, {}, { withCredentials: true });

    return {
      message: res.data.message,
      clearedBooks: [],
    };
  } catch (err: any) {
    if (err.response?.data?.message) {
      return {
        message: err.response.data.message,
        clearedBooks: [],
      };
    } else {
      console.error(err);
      return {
        message: "An error occurred during checkout.",
        clearedBooks: [],
      };
    }
  }
};