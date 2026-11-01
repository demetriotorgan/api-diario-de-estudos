import express from 'express';
import prioridadeRoutes from './routes/PrioridadeRoutes.js';
import objetivosRoutes from './routes/ObjetivoRoutes.js';

const app = express();

app.use(express.json());

app.use('/api/prioridades', prioridadeRoutes);
app.use('/api/objetivos', objetivosRoutes);

app.get('/healf', (_req,res)=>{
    res.status(200).json({
        status:'ok',
        message:'API Diários de estudos'
    })
});

export default app;