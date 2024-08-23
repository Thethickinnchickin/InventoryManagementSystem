"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./OrdersPage.module.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]); // Initialize as an empty array
  const [products, setProducts] = useState([]);
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    shippingAddress: "",
    items: [],
    totalAmount: 0,
  });
  const [editMode, setEditMode] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [page]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/orders", {
        params: { page, limit: 10 },
      });
      setOrders(response.data.orders || []); // Ensure orders is set to an empty array if undefined
      setTotalPages(response.data.totalPages || 1); // Ensure totalPages has a default value
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]); // Set to empty array on error
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data || []); // Ensure products is set to an empty array if undefined
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); // Set to empty array on error
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderForm({ ...orderForm, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...orderForm.items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    setOrderForm({ ...orderForm, items: updatedItems });
  };

  const handleAddItem = () => {
    setOrderForm({
      ...orderForm,
      items: [...orderForm.items, { productId: "", quantity: 1, price: 0 }],
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = orderForm.items.filter((_, i) => i !== index);
    setOrderForm({ ...orderForm, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`http://localhost:3000/orders/${currentOrderId}`, orderForm);
      } else {
        await axios.post("http://localhost:3000/orders", orderForm);
      }
      setOrderForm({ customerName: "", shippingAddress: "", items: [], totalAmount: 0 });
      setEditMode(false);
      setCurrentOrderId(null);
      fetchOrders();
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  const handleEditOrder = (order) => {
    setOrderForm({
      customerName: order.customerName,
      shippingAddress: order.shippingAddress,
      items: order.items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: order.totalAmount,
    });
    setEditMode(true);
    setCurrentOrderId(order.id);
  };

  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/orders/${id}`);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Orders Management</h1>
      
      <section className={styles.formSection}>
        <h2 className={styles.subheading}>{editMode ? "Edit Order" : "Create New Order"}</h2>
        <form onSubmit={handleSubmit} className={styles.orderForm}>
          <input
            type="text"
            name="customerName"
            value={orderForm.customerName}
            onChange={handleInputChange}
            placeholder="Customer Name"
            required
          />
          <input
            type="text"
            name="shippingAddress"
            value={orderForm.shippingAddress}
            onChange={handleInputChange}
            placeholder="Shipping Address"
            required
          />
          {orderForm.items.map((item, index) => (
            <div key={index} className={styles.itemRow}>
              <select
                name="productId"
                value={item.productId}
                onChange={(e) => handleItemChange(index, e)}
                className={styles.select}
                required
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, e)}
                min="1"
                className={styles.input}
                required
              />
              <input
                type="number"
                name="price"
                value={item.price}
                onChange={(e) => handleItemChange(index, e)}
                min="0"
                step="0.01"
                className={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className={styles.removeButton}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className={styles.addButton}
          >
            Add Item
          </button>
          <h2 className={styles.subheading}>Order Total</h2>
          <input
            type="number"
            name="totalAmount"
            value={orderForm.totalAmount}
            onChange={handleInputChange}
            placeholder="Total Amount"
            min="0"
            step="0.01"
            className={styles.input}
            required
          />
          <button type="submit" className={styles.submitButton}>
            {editMode ? "Update Order" : "Create Order"}
          </button>
        </form>
      </section>

      <section className={styles.orderListSection}>
        <h2 className={styles.subheading}>Orders List</h2>
        <ul className={styles.orderList}>
          {orders.length > 0 ? (
            orders.map((order) => (
              <li key={order.id} className={styles.orderListItem}>
                <span>
                  {order.customerName} - ${order.totalAmount}
                </span>
                <div className={styles.orderActions}>
                  <button
                    onClick={() => handleEditOrder(order)}
                    className={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li>No orders available</li>
          )}
        </ul>
      </section>

      <section className={styles.paginationSection}>
        <div className={styles.pagination}>
          <button
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            className={styles.pageButton}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
            className={styles.pageButton}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default OrdersPage;
