import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config(); // Should be called before using in imports
import { connectDB } from './db';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(routes);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
