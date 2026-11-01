import { PrioridadeModel } from "../models/Prioridade.js"

export const buscarPrioridadeId = async(id: string) => {
    return await PrioridadeModel.findById(id);
}