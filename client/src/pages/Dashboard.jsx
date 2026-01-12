import { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import axios from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
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

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await axios.get("/reports/analytics");
      setChartData(res.data.categoryDistribution);
    };
    fetchAnalytics();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

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
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Stock by Category
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Placeholder for Recent Activity or Stock Table */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400, overflow: "auto" }}>
            <Typography variant="h6" gutterBottom>
              Low Stock Alerts
            </Typography>
            {/* Map through products with 'Low Stock' status here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
