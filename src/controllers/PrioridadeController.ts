import { Request, Response } from 'express';
import {PrioridadeModel} from '../models/Prioridade.js'

export const criarPrioridade = async(req: Request,res: Response): Promise<void>=>{
    try {
        const {nome, classificacao, descricao} = req.body

        const novaPrioridade = await PrioridadeModel.create({nome, classificacao,descricao});
        res.status(201).json(novaPrioridade)
    } catch (error) {
        console.error('Erro ao registrar prioridade: ', error);
        res.status(500).json({
            erro:'Erro ao salvar prioridade',
            message: error
        })
    }
};

export const listarPrioridades = async(req:Request, res:Response):Promise<void> =>{
    try {
        const prioridades = await PrioridadeModel.find().sort({createdAt:-1});
        res.status(200).json(prioridades);
    } catch (error) {
        console.error('Erro ao listar prioridades');
        res.status(500).json({
            erro:'Erro ao listar prioridades',
            message:error
        })
    }
};

export const desativarPrioridade = async(req:Request, res:Response): Promise<void> =>{
    const {id} = req.params;
    try {
        const deletado = await PrioridadeModel.findByIdAndUpdate(id,
            {ativa:false},
            {new:true}
        )
        if(!deletado){
            res.status(404).json({erro:'Registro não encontrado'})
            return;
        }
        res.status(200).json({message:'Prioridade desativada com sucesso'});
    } catch (error) {
        console.error('Erro ao excluir prioridade: ', error);
        res.status(500).json({
            erro:'Erro ao excluir prioridade'
        })
    }
};

