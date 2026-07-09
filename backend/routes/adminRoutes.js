const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware'); // Your auth guards

router.get('/analytics/overview', protect, admin, async (req, res) => {
  try {
    // 1. Pipeline for Financials (MRR and Security Deposits)
    const financialStats = await Rental.aggregate([
      { $match: { status: { $ne: 'returned' } } }, // Only look at active subscriptions
      {
        $group: {
          _id: null,
          totalMRR: { $sum: '$monthlyRentPrice' },
          totalDeposits: { $sum: '$securityDepositPaid' },
          activeLeasesCount: { $sum: 1 }
        }
      }
    ]);

    // 2. Pipeline for Asset Utilization Rates
    const totalInventoryStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalStockPool: { $sum: '$stock' }
        }
      }
    ]);

    // Format safe fallback defaults if the database collections are empty
    const financials = financialStats[0] || { totalMRR: 0, totalDeposits: 0, activeLeasesCount: 0 };
    const inventory = totalInventoryStats[0] || { totalStockPool: 0 };

    // Calculate utilization percentage: (Active Leases / (Active Leases + Available Stock)) * 100
    const totalItemsOwned = financials.activeLeasesCount + inventory.totalStockPool;
    const utilizationRate = totalItemsOwned > 0 
      ? Math.round((financials.activeLeasesCount / totalItemsOwned) * 100) 
      : 0;

    res.json({
      success: true,
      metrics: {
        monthlyRecurringRevenue: financials.totalMRR,
        securityDepositsHeld: financials.totalDeposits,
        activeSubscriptions: financials.activeLeasesCount,
        assetUtilizationRate: utilizationRate
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to compute asset pipeline metrics.', error: err.message });
  }
});

module.exports = router;