"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./OrdersPage.module.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
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

  // Filter states
  const [filterCustomerName, setFilterCustomerName] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [page, filterCustomerName, filterStartDate, filterEndDate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/orders", {
        params: {
          page,
          limit: 10,
          customerName: filterCustomerName,
          startDate: filterStartDate,
          endDate: filterEndDate,
        },
      });
      setOrders(response.data.orders || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); // Set an empty array in case of error
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderForm({ ...orderForm, [name]: value });
  };

  const handleItemChange = async (index: number, e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedItems = [...orderForm.items];

    if (name === 'productId') {
      // Find the selected product
      const selectedProduct = products.find(product => product.id === parseInt(value, 10));
      if (selectedProduct) {
        // Update the item with selected product and its price
        updatedItems[index] = {
          ...updatedItems[index],
          productId: parseInt(value, 10),
          price: parseFloat(selectedProduct.price).toFixed(2),
          quantity: updatedItems[index]?.quantity || 1, // Preserve existing quantity
        };
      }
    } else if (name === 'quantity') {
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: parseInt(value, 10),
      };
    } else if (name === 'price') {
      updatedItems[index] = {
        ...updatedItems[index],
        price: value,
      };
    }

    setOrderForm({ ...orderForm, items: updatedItems });
  };

  const handleAddItem = () => {
    setOrderForm({
      ...orderForm,
      items: [
        ...orderForm.items,
        { productId: "", quantity: 1, price: "0.00" },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = orderForm.items.filter((_, i) => i !== index);
    setOrderForm({ ...orderForm, items: updatedItems });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const handleEditOrder = (order: any) => {
    setOrderForm({
      customerName: order.customerName,
      shippingAddress: order.shippingAddress,
      items: order.items.map((item: any) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: parseFloat(item.price).toFixed(2), // Convert to decimal format
      })),
      totalAmount: parseFloat(order.totalAmount).toFixed(2), // Convert to decimal format
    });
    setEditMode(true);
    setCurrentOrderId(order.id);
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/orders/${id}`);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Orders Management</h1>
      
      <section className={styles.filterSection}>
        <h2 className={styles.subheading}>Filter Orders</h2>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Filter by Customer Name"
            value={filterCustomerName}
            onChange={(e) => setFilterCustomerName(e.target.value)}
            className={styles.input}
          />
          <input
            type="date"
            placeholder="Start Date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className={styles.input}
          />
          <input
            type="date"
            placeholder="End Date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className={styles.input}
          />
          <button onClick={fetchOrders} className={styles.filterButton}>
            Apply Filters
          </button>
        </div>
      </section>

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
            className={styles.input}
          />
          <input
            type="text"
            name="shippingAddress"
            value={orderForm.shippingAddress}
            onChange={handleInputChange}
            placeholder="Shipping Address"
            required
            className={styles.input}
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
                  <strong>{order.customerName}</strong> - ${parseFloat(order.totalAmount).toFixed(2)}, <strong>Order Placed:</strong> {new Date(order.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  })}
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
    </div>
  );
};

export default OrdersPage;
