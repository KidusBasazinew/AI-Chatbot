import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import router from './routes/router';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.use('/api/v1', router);

app.listen(port, () => {
   console.log(`Server running on http://localhost:${port}`);
});
