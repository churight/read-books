import axios from "axios";
import { useEffect, useState } from "react";
import { Cart } from "../interfaces/ICart";

export const usePurchaseHistory = (activeTab: string) => {
  const [cartHistory, setCartHistory] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (activeTab !== "purchaseHistory") return;

      setLoading(true);
      try {
        const res = await axios.get("http://localhost:4000/api/buy/cart/history", {
          withCredentials: true,
        });
        const cartData = res.data.cart;
        setCartHistory(Array.isArray(cartData) ? cartData : []);
        //console.log("Fetched cart data:", res.data.cart);
      } catch (error) {
        console.error("Failed to fetch purchase history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [activeTab]);

  return { cartHistory, loading };
};
