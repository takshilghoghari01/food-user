import React, { useState } from "react";
import OrderConfirmationModal from "./OrderConfirmationModal";
import { createOrder } from "../api";

const OrderProcess = ({ user, items, onClose, clearCart }) => {
  const [tableNumber] = useState(() => {
    return localStorage.getItem("tableNumber") || "";
  });
  const [orderId, setOrderId] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  // Compute total from cart in localStorage (including tax)
  const getTotalAmount = () => {
    const cartJson = localStorage.getItem("fp_cart");
    const cartObj = cartJson ? JSON.parse(cartJson) : {};
    let subtotal = 0;
    for (const [key, entry] of Object.entries(cartObj)) {
      const fullItem = items.find((i) => String(i._id) === key);
      if (!fullItem || !entry.qty) continue;
      const price =
        fullItem.discount > 0
          ? fullItem.price * (1 - fullItem.discount / 100)
          : fullItem.price;
      subtotal += price * entry.qty;
    }
    const tax = subtotal * 0.05;
    return subtotal + tax;
  };

  // Compute order items from cart
  const getOrderItems = () => {
    const cartJson = localStorage.getItem("fp_cart");
    const cartObj = cartJson ? JSON.parse(cartJson) : {};
    return Object.entries(cartObj)
      .map(([key, entry]) => {
        const fullItem = items.find((i) => String(i._id) === key);
        if (!fullItem || !entry.qty) return null;
        const priceAtOrder =
          fullItem.discount > 0
            ? fullItem.price * (1 - fullItem.discount / 100)
            : fullItem.price;
        return {
          itemId: fullItem._id || key,
          itemName: fullItem.name,
          quantity: entry.qty,
          priceAtOrder,
        };
      })
      .filter(Boolean);
  };

  const handlePayment = async (method, table) => {
    if (!validateTableNumber(table)) return { success: false };

    if (getTotalAmount() === 0) {
      alert("Your cart is empty. Please add items before placing an order.");
      return { success: false };
    }

    try {
      // Create order via API
      const orderItemsData = getOrderItems();
      const orderData = {
        items: orderItemsData,
        tableNumber: parseInt(table),
        paymentMethod: method,
        totalAmount: getTotalAmount(),
      };

      const newOrder = await createOrder(orderData);
      setOrderId(newOrder._id);
      setOrderItems(orderItemsData);

      // Clear cart
      localStorage.removeItem("fp_cart");
      if (clearCart) clearCart();

      return {
        success: true,
        orderId: newOrder._id,
        orderItems: orderItemsData,
      };
    } catch (error) {
      console.error("Error creating order:", error);
      return { success: false };
    }
  };

  const validateTableNumber = (value) => {
    if (value.trim() === "") {
      return false;
    }
    const numVal = Number(value);
    if (!Number.isInteger(numVal)) {
      return false;
    }
    if (numVal < 1 || numVal > 30) {
      return false;
    }
    localStorage.setItem("tableNumber", value);
    return true;
  };

  return (
    <OrderConfirmationModal
      userName={user?.username || "John Doe"}
      userPhone={user?.phone || "+91 9876543210"}
      initialTableNumber={tableNumber}
      totalAmount={getTotalAmount()}
      initialOrderId={orderId}
      initialOrderItems={orderItems}
      onClose={onClose}
      onPayment={handlePayment}
    />
  );
};

export default OrderProcess;
