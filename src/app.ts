// src/app.ts
import express from 'express';
import cors from 'cors';
import myListRoutes from './routes/myList'; 

const app = express();
app.use(cors());
app.use(express.json());

app.use('/my-list', myListRoutes);

export default app;
