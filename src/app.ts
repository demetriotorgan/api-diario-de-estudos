import express from 'express';
import prioridadeRoutes from './routes/PrioridadeRoutes.js';
import objetivosRoutes from './routes/ObjetivoRoutes.js';
import registroExecucaoRoutes from './routes/RegistroExecucaoRoutes.js'

const app = express();

app.use(express.json());

app.use('/api/prioridades', prioridadeRoutes);
app.use('/api/objetivos', objetivosRoutes);
app.use('/api/registros', registroExecucaoRoutes);

app.get('/healf', (_req,res)=>{
    res.status(200).json({
        status:'ok',
        message:'API Diários de estudos'
    })
});

export default app;