import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

const DATA_DIR = path.resolve(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory and orders file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([]), 'utf-8');
}

// Helper to read orders
function readOrders() {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

// Helper to write orders
function writeOrders(orders: any[]) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

// API Routes
app.get('/api/orders', (req, res) => {
  const orders = readOrders();
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  try {
    const newOrder = req.body;
    const orders = readOrders();
    orders.unshift(newOrder);
    writeOrders(orders);

    // Automated backend owner dispatch notification
    console.log(`[ICON ACTIVEWEAR AUTOMATED DISPATCH] Order #${newOrder.id} logged for Nazneen (+92 311 3270742 / nazneenrizvi1711@gmail.com). Customer: ${newOrder.customerName}, Phone: ${newOrder.phone}, Amount: Rs. ${newOrder.total}`);

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record order' });
  }
});

app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const orders = readOrders();
    const orderIndex = orders.findIndex((o: any) => o.id === id);
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      writeOrders(orders);
      return res.json({ success: true, order: orders[orderIndex] });
    }
    res.status(404).json({ error: 'Order not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.delete('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    let orders = readOrders();
    orders = orders.filter((o: any) => o.id !== id);
    writeOrders(orders);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

app.delete('/api/orders', (req, res) => {
  try {
    writeOrders([]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear orders' });
  }
});

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ICON ACTIVEWEAR Full-Stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
