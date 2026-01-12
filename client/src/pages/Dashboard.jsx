import { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import axios from "../api/axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    inventoryValue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get("/reports/dashboard-stats");
      setStats(res.data);
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Paper
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        bgcolor: color,
        color: "white",
      }}
    >
      <Box sx={{ mr: 2 }}>{icon}</Box>
      <Box>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<InventoryIcon fontSize="large" />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Low Stock"
            value={stats.lowStockCount}
            icon={<WarningIcon fontSize="large" />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Value"
            value={`$${stats.inventoryValue}`}
            icon={<AttachMoneyIcon fontSize="large" />}
            color="#2e7d32"
          />
        </Grid>
      </Grid>
      {/* Add Chart.js components here later */}
    </Box>
  );
};

export default Dashboard;
