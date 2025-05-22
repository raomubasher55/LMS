"use client";
import { createContext, useContext, useEffect, useState } from "react";
import useSweetAlert from "@/hooks/useSweetAlert";
import axios from "axios";

const wishlistContext = createContext(null);

const WishlistContextProvider = ({ children }) => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const createAlert = useSweetAlert();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || sessionStorage.getItem("token")
      : null;

  // Fetch wishlist from backend
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;
  
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistProducts(res.data?.wishlist || []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };
  
    fetchWishlist();
  }, []);
  

  // Add to wishlist (backend)
  const addProductToWishlist = async ({ id }) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist`,
        { courseId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWishlistProducts(res.data.wishlist);
      createAlert("success", res.data?.message || "Success!");
    } catch (err) {
      createAlert("error", err?.response?.data?.message || "Already in wishlist.");
    }
  };

  // Remove from wishlist (backend)
  const deleteProductFromWishlist = async (courseId) => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWishlistProducts(res.data.wishlist);
      createAlert("success", "Deleted from wishlist.");
    } catch (err) {
      createAlert("error", "Failed to delete.");
    }
  };

  return (
    <wishlistContext.Provider
      value={{
        wishlistProducts,
        addProductToWishlist,
        deleteProductFromWishlist,
      }}
    >
      {children}
    </wishlistContext.Provider>
  );
};

export const useWishlistContext = () => useContext(wishlistContext);
export default WishlistContextProvider;
