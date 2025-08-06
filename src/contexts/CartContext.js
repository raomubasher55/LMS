"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
  import useSweetAlert from "@/hooks/useSweetAlert";

const cartContext = createContext(null);

const CartContextProvider = ({ children }) => {
  const [cartProductsCheck, setCartProducts] = useState([]);

  const createAlert = useSweetAlert();
  const getToken = () =>
    typeof window !== "undefined" &&
    (localStorage.getItem("token") || sessionStorage.getItem("token"));

  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  useEffect(() => {
    const fetchCartData = async () => {
      const token = getToken();
      if (!token) {
        console.log("No token found — skipping cart fetch");
        setCartProducts([]);
        return;
      }
  
      try {
        const { data } = await axiosInstance.get("/api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartProducts(data.wishlist || []);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartProducts([]);
      }
    };
  
    fetchCartData();
  }, []);
  

  const addProductToCart = async (newCourse, isDecrement = false, isTotalQuantity = false) => {
    try {
      const { id: courseId, quantity: currentQuantity } = newCourse;
   
      const existingProduct = cartProductsCheck.find(product => 
        product.course && (product.course.id === courseId || product.course._id === courseId)
      );

      let updatedCart;

      if (existingProduct) {
        const updatedQuantity = isTotalQuantity
          ? currentQuantity
          : isDecrement
          ? existingProduct.quantity - currentQuantity
          : existingProduct.quantity + currentQuantity;

        updatedCart = cartProductsCheck.map(product =>
          product.course && (product.course.id === courseId || product.course._id === courseId)
            ? { ...product, quantity: Math.max(updatedQuantity, 1) }
            : product
        );

        await axiosInstance.put(`/api/wishlist/${courseId}`, {
          quantity: updatedCart.find(product => 
            product.course && (product.course.id === courseId || product.course._id === courseId)
          ).quantity,
        });

        createAlert("success", "Success! Quantity updated.");
      } else {
        updatedCart = [...cartProductsCheck, newCourse];

        await axiosInstance.post("/api/wishlist", {
          courseId: newCourse.id,
          quantity: newCourse.quantity || 1,
        });

        createAlert("success", "Success! Added to cart.");
      }

      setCartProducts(updatedCart);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      createAlert("error", "Failed to update the cart.");
    }
  };

  const deleteProductFromCart = async (idToRemove) => {
    try {
      await axiosInstance.delete(`/api/wishlist/${idToRemove}`);

      const updatedCart = cartProductsCheck.filter(product => 
        product.course && (product.course.id !== idToRemove && product.course._id !== idToRemove)
      );
      setCartProducts(updatedCart);
      createAlert("success", "Success! Product removed from cart.");
    } catch (error) {
      console.error("Error removing product from cart:", error);
      createAlert("error", "Failed to remove the product.");
    }
  };

  const deleteCartProducts = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  
    if (!token) {
      createAlert("error", "No token found, please log in.");
      return;
    }
  
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist/emptyCart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        setCartProducts([]);
        createAlert("success", "Success! Cart is now empty.");
      }
    } catch (error) {
      console.error("Error clearing the cart:", error);
      createAlert("error", "Failed to clear the cart.");
    }
  };
  
  
  

  return (
    <cartContext.Provider
      value={{
        cartProductsCheck,
        setCartProducts,
        addProductToCart,
        deleteProductFromCart,
        deleteCartProducts
      }}
    >
      {children}
    </cartContext.Provider>
  );
};

export const useCartContext = () => useContext(cartContext);
export default CartContextProvider;
