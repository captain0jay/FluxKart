import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './API/routes/index.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);

app.get('/', (_req: Request, res: Response) => {
    res.send({ message: 'Welcome to FluxKart.com your one stop solution to any time travel needs :)' })
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});