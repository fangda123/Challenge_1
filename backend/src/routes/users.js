const express = require('express');
const router = express.Router();
const Joi = require('joi');
const store = require('../data-store');

const usersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(200).default(50),
  search: Joi.string().allow('', null).default(''),
  sortBy: Joi.string().valid('name','email','createdAt','orderTotal').default('name'),
  sortDir: Joi.string().valid('asc','desc').default('asc')
});

router.get('/api/users', (req, res) => {
  const { error, value } = usersQuerySchema.validate(req.query);
  if (error) return res.status(400).json({ error: error.message });
  const { page, pageSize, search, sortBy, sortDir } = value;

  let candidates;
  if (search && search.trim().length > 0) {
    const s = search.toLowerCase();
    candidates = store.users.filter(u => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  } else {
    candidates = store.users;
  }

  const rows = candidates.map(u => {
    const agg = store.userAggMap.get(u.id) || { count: 0, total: 0 };
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
      orderCount: agg.count,
      orderTotal: agg.total
    };
  });

  const dir = sortDir === 'asc' ? 1 : -1;
  rows.sort((a,b) => {
    if (sortBy === 'orderTotal') {
      if (a.orderTotal === b.orderTotal) return a.id - b.id;
      return (a.orderTotal - b.orderTotal) * dir;
    }
    if (sortBy === 'createdAt') {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      if (ta === tb) return a.id - b.id;
      return (ta - tb) * dir;
    }
    const va = (a[sortBy] || '').toLowerCase();
    const vb = (b[sortBy] || '').toLowerCase();
    if (va === vb) return a.id - b.id;
    return va < vb ? -1 * dir : 1 * dir;
  });

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const items = rows.slice(start, start + pageSize);
  res.json({ items, total, page, pageSize });
});

router.get('/api/users/:id/orders', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (!Number.isInteger(userId)) return res.status(400).json({ error: 'Invalid user id' });
  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const pageSize = Math.min(200, Math.max(1, parseInt(req.query.pageSize || '50', 10)));
  const arr = store.userOrderMap.get(userId) || [];
  const sorted = arr.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  const total = sorted.length;
  const start = (page -1) * pageSize;
  const items = sorted.slice(start, start + pageSize);
  res.json({ items, total, page, pageSize });
});

module.exports = router;
