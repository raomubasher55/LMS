"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const usePaymentMethods = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Make API request with token
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-methods`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data && response.data.success) {
        setPaymentMethods(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch payment methods');
      }
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError(err?.message || String(err) || 'Failed to fetch payment methods');
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async (paymentData) => {
    try {
      setLoading(true);
      
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Make API request with token
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-methods`,
        paymentData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data && response.data.success) {
        // Refresh the payment methods list
        await fetchPaymentMethods();
        toast.success('Payment method added successfully');
        return true;
      } else {
        throw new Error(response.data?.message || 'Failed to add payment method');
      }
    } catch (err) {
      console.error('Error adding payment method:', err);
      setError(err?.message || String(err) || 'Failed to add payment method');
      toast.error(err.response?.data?.message || err?.message || 'Failed to add payment method');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentMethod = async (paymentMethodId, updateData) => {
    try {
      setLoading(true);
      
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Make API request with token
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-methods/${paymentMethodId}`,
        updateData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data && response.data.success) {
        // Refresh the payment methods list
        await fetchPaymentMethods();
        toast.success('Payment method updated successfully');
        return true;
      } else {
        throw new Error(response.data?.message || 'Failed to update payment method');
      }
    } catch (err) {
      console.error('Error updating payment method:', err);
      setError(err?.message || String(err) || 'Failed to update payment method');
      toast.error(err.response?.data?.message || err?.message || 'Failed to update payment method');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePaymentMethod = async (paymentMethodId) => {
    try {
      setLoading(true);
      
      // Get token from local storage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Make API request with token
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment-methods/${paymentMethodId}`,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data && response.data.success) {
        // Refresh the payment methods list
        await fetchPaymentMethods();
        toast.success('Payment method deleted successfully');
        return true;
      } else {
        throw new Error(response.data?.message || 'Failed to delete payment method');
      }
    } catch (err) {
      console.error('Error deleting payment method:', err);
      setError(err?.message || String(err) || 'Failed to delete payment method');
      toast.error(err.response?.data?.message || err?.message || 'Failed to delete payment method');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment methods on component mount
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return {
    paymentMethods,
    loading,
    error,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    refetch: fetchPaymentMethods
  };
};

export default usePaymentMethods;