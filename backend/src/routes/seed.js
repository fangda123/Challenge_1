const express = require('express');
const router = express.Router();
const store = require('../data-store');

// deterministic RNG (mulberry32)
function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

router.post('/dev/seed', (req, res) => {
  const q = req.query;
  const numUsers = Math.min(200000, parseInt(q.users || '50000', 10));
  const numOrders = Math.min(5000000, parseInt(q.orders || '500000', 10));
  const numProducts = Math.min(200000, parseInt(q.products || '10000', 10));
  const seed = q.seed ? parseInt(q.seed, 10) : 12345;

  store.resetStores();
  const rng = mulberry32(seed);

  const firsts = ['Alex','Sam','Chris','Pat','Taylor','Jordan','Morgan','Lee','Casey','Jamie'];
  const lasts = ['Smith','Johnson','Brown','Williams','Jones','Davis','Miller','Wilson','Moore','Taylor'];

  for (let i = 0; i < numUsers; i++) {
    const id = i + 1;
    const f = firsts[Math.floor(rng() * firsts.length)];
    const l = lasts[Math.floor(rng() * lasts.length)];
    const name = `${f} ${l}${Math.floor(rng()*1000)}`;
    const email = `${f.toLowerCase()}.${l.toLowerCase()}${id}@example.com`;
    const createdAt = new Date(Date.now() - Math.floor(rng() * 5 * 365 * 24 * 3600 * 1000)).toISOString();
    store.users.push({ id, name, email, createdAt });
    store.userOrderMap.set(id, []);
    store.userAggMap.set(id, { count: 0, total: 0 });
  }

  for (let p = 0; p < numProducts; p++) {
    const id = p + 1;
    store.products.push({ id, name: `Product ${id}`, price: Math.round((rng() * 500 + 5) * 100) / 100 });
  }

  for (let o = 0; o < numOrders; o++) {
    const id = o + 1;
    const userId = Math.floor(rng() * numUsers) + 1;
    const productId = Math.floor(rng() * numProducts) + 1;
    const product = store.products[productId - 1];
    const qty = Math.floor(rng() * 5) + 1;
    const amount = Math.round(product.price * qty * 100) / 100;
    const createdAt = new Date(Date.now() - Math.floor(rng() * 3 * 365 * 24 * 3600 * 1000)).toISOString();
    const order = { id, userId, productId, amount, createdAt, qty };
    store.orders.push(order);
    store.userOrderMap.get(userId).push(order);
    const agg = store.userAggMap.get(userId);
    agg.count += 1;
    agg.total = Math.round((agg.total + amount) * 100) / 100;
  }

  res.json({ users: store.users.length, products: store.products.length, orders: store.orders.length, seed });
});

module.exports = router;
