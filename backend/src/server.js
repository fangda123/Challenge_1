const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const seedRoute = require('./routes/seed');
const usersRoute = require('./routes/users');

const app = express();
app.use(express.json());
app.use(compression());
app.use(cors());
app.use(helmet());

const usersLimiter = rateLimit({ windowMs: 60 * 1000, max: 200 });
app.use('/api/users', usersLimiter);

app.use(seedRoute);
app.use(usersRoute);
app.get('/health', (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Backend listening at ${port}`));
module.exports = app;
