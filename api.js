const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173', // Vite default
  'http://localhost:3000', 
  'https://timelesspk-frontend.vercel.app' // Your actual frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS Policy Blocked: Origin not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));