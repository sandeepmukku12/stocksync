import { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../api/axios";
import { toast } from "react-toastify";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchCategories = async () => {
    const { data } = await axios.get("/categories");
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`/categories/${selectedId}`);
      toast.success("Category and linked products removed!");
      setOpen(false);
      fetchCategories(); // Refresh list
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Button variant="contained" color="primary" sx={{ mb: 2 }}>
        Add Category
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat._id}>
              <TableCell>{cat.name}</TableCell>
              <TableCell>{cat.description}</TableCell>
              <TableCell align="right">
                <Button
                  color="error"
                  onClick={() => {
                    setSelectedId(cat._id);
                    setOpen(true);
                  }}
                >
                  <DeleteIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Are you sure? This will delete ALL products in this category.
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Yes, Delete Everything
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Categories;
