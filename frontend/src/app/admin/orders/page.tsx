"use client";
import styles from "./OrdersPage.module.css";


import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Grid
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface OrderItem {
  productId: number;
  quantity: number;
  price: string;
}

interface OrderForm {
  customerName: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    customerName: "",
    shippingAddress: "",
    items: [],
    totalAmount: 0,
  });
  const [editMode, setEditMode] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filterCustomerName, setFilterCustomerName] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [page, filterCustomerName, filterStartDate, filterEndDate]);

  const fetchOrders = async () => {
    const cookieString = document.cookie;
    const token = cookieString
      .split("; ")
      .find((row) => row.startsWith("authToken"))
      ?.split("=")[1];

    try {
      const response = await axios.get(`${process.env.API_URL || 'http://localhost:3000'}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
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
      const response = await axios.get(`${process.env.API_URL || 'http://localhost:3000'}/products`);
      setProducts(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderForm({ ...orderForm, [name]: value });
  };

  const handleItemChange = async (
    index: number,
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedItems = [...orderForm.items];

    if (name === "productId") {
      const selectedProduct = products.find(
        (product) => product.id === parseInt(value, 10)
      );
      if (selectedProduct) {
        updatedItems[index] = {
          ...updatedItems[index],
          productId: selectedProduct.id,
          price: selectedProduct.price.toFixed(2),
          quantity: updatedItems[index]?.quantity || 1,
        };
      }
    } else if (name === "quantity") {
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: parseInt(value, 10),
      };
    } else if (name === "price") {
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
        { productId: 0, quantity: 1, price: "0.00" },
      ],
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = orderForm.items.filter((_, i) => i !== index);
    setOrderForm({ ...orderForm, items: updatedItems });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cookieString = document.cookie;
    const token = cookieString
      .split("; ")
      .find((row) => row.startsWith("authToken"))
      ?.split("=")[1];

    try {
      if (editMode && currentOrderId !== null) {
        await axios.put(
          `${process.env.API_URL || 'http://localhost:3000'}/orders/${currentOrderId}`,
          orderForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(`${process.env.API_URL || 'http://localhost:3000'}/orders`, orderForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setOrderForm({
        customerName: "",
        shippingAddress: "",
        items: [],
        totalAmount: 0,
      });
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
        price: parseFloat(item.price),
      })),
      totalAmount: parseFloat(order.totalAmount),
    });
    setEditMode(true);
    setCurrentOrderId(order.id);
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      const cookieString = document.cookie;
      const token = cookieString
        .split("; ")
        .find((row) => row.startsWith("authToken"))
        ?.split("=")[1];
      await axios.delete(`${process.env.API_URL || 'http://localhost:3000'}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Orders Management</Typography>

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
        <h2 className={styles.subheading}>
          {editMode ? "Edit Order" : "Create New Order"}
        </h2>
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
          <button type="submit" className={styles.submitButton}>
            {editMode ? "Update Order" : "Create Order"}
          </button>
        </form>
      </section>
      <section>
        <Typography variant="h6" gutterBottom>
          Orders List
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Shipping Address</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.shippingAddress}</TableCell>
                  <TableCell>${order.totalAmount}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditOrder(order)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2} justifyContent="center" style={{ marginTop: 16 }}>
          <Grid item>
            <Button
              variant="outlined"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </section>
    </Container>
  );
};

export default OrdersPage;
