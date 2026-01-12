import { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axios from "../api/axios";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);

  // Search & Filter State
  const [filters, setFilters] = useState({ search: "", status: "" });

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    supplier: "",
    quantity: 0,
    price: 0,
  });

  const fetchData = async () => {
    try {
      const pRes = await axios.get("/products", { params: filters });
      const cRes = await axios.get("/categories");
      const sRes = await axios.get("/suppliers");
      setProducts(pRes.data);
      setCategories(cRes.data);
      setSuppliers(sRes.data);
    } catch (err) {
      toast.error("Error loading data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/products", formData);
      toast.success("Product added to stock");
      setOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding product");
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Inventory Stock
      </Typography>

      {/* Search & Filter Bar */}
      <Paper sx={{ p: 2, mb: 3, display: "flex", gap: 2 }}>
        <TextField
          label="Search Name/SKU"
          size="small"
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <TextField
          select
          label="Status"
          size="small"
          sx={{ width: 150 }}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="In Stock">In Stock</MenuItem>
          <MenuItem value="Low Stock">Low Stock</MenuItem>
          <MenuItem value="Out of Stock">Out of Stock</MenuItem>
        </TextField>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Add Product
        </Button>
      </Paper>

      {/* Product Table */}
      <Table component={Paper}>
        <TableHead>
          <TableRow sx={{ bgcolor: "#f5f5f5" }}>
            <TableCell>SKU</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p.sku}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.category?.name}</TableCell>
              <TableCell>{p.quantity}</TableCell>
              <TableCell>
                <Typography
                  color={p.status === "In Stock" ? "green" : "red"}
                  variant="body2"
                  fontWeight="bold"
                >
                  {p.status}
                </Typography>
              </TableCell>
              <TableCell>${p.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Product Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Inventory Item</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Product Name"
              required
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextField
              label="SKU"
              required
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
            />

            <TextField
              select
              label="Category"
              required
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {categories.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Supplier"
              required
              onChange={(e) =>
                setFormData({ ...formData, supplier: e.target.value })
              }
            >
              {suppliers.map((s) => (
                <MenuItem key={s._id} value={s._id}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Qty"
                type="number"
                fullWidth
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />
              <TextField
                label="Price"
                type="number"
                fullWidth
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </Box>

            <Button type="submit" variant="contained" size="large">
              Create Product
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Products;
