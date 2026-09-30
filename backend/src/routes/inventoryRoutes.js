const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { auth } = require('../middlewares/auth');
const { admin } = require('../middlewares/admin');

// All inventory routes require admin access
router.use(auth, admin);

router.get('/', inventoryController.getInventory);
router.get('/low-stock', inventoryController.getLowStockProducts);
router.get('/logs', inventoryController.getInventoryLogs);
router.get('/logs/:productId', inventoryController.getProductInventoryHistory);
router.get('/product/:productId/history', inventoryController.getProductInventoryHistory);
router.post('/restock', inventoryController.restockProduct);
router.post('/adjust', inventoryController.adjustStock);

module.exports = router;
