
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// In-memory user store (for demo purposes; replace with a DB in production)
const users = [];

// Middleware
app.use(bodyParser.json());

// Rate Limiter: 10 requests per hour for /execute endpoint
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Too many requests from this IP, please try again after an hour'
});
app.use('/execute', limiter);

// Helper function for JWT authentication
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Route: Register a New User
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'User registered successfully' });
});

// Route: Login and Get a JWT Token
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Route: Code Execution Endpoint (Stub)
app.post('/execute', authenticateToken, (req, res) => {
  const { code, language, input } = req.body;
  if (!code || !language) {
    return res.status(400).json({ message: 'Code and language are required' });
  }

  // Stub: Replace with sandboxed Docker execution in future steps
  const executionResult = {
    output: `Executed code in ${language}: ${code.substring(0, 50)}...`,
    errors: null,
    executionTime: '0.001s',
    memoryUsage: 'N/A'
  };

  res.json(executionResult);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
