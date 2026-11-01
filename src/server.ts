import 'dotenv/config'

import app from './app.js';
import connectDB from './config/database.js'

const PORT = process.env.PORT || 3000;

async function iniciarServidor():Promise<void>{
    try {
        await connectDB();
        app.listen(PORT, ()=>{
            console.log(`Servidor executando na porta ${PORT}`)
        });
    } catch (error) {        
        console.error('Erro ao iniciar aplicação: ', error);
        process.exit(1);
    }
}

iniciarServidor();