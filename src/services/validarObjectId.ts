import mongoose from "mongoose";

export const validarObjetoId = (id: unknown): id is string =>{
    return typeof id === 'string' && mongoose.isValidObjectId(id);
}