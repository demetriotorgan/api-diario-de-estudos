import mongoose from 'mongoose'


let isConnected: boolean = false;
const uri = process.env.MONGO_URI

if(!uri){
    throw new Error('MONGO_URI não definida no ambiente');
}

const  connectDB = async ()=>{
    if(isConnected){
        return
    }
    try {
        const db = await mongoose.connect(uri);
        isConnected = db.connections[0].readyState === 1;
        console.log(`MongoDB conectado ao banco ${db.connection.name}`)
    } catch (error) {
        if (error instanceof Error){
            console.error('Erro ao conectar ao MongoDB: ', error.message)
        }
        throw error;    
    }
}

export default connectDB;