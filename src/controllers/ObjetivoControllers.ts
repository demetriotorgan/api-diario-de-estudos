import { Request, Response } from "express";
import { ObjetivoModel } from '../models/Objetivo.js'
import { PrioridadeModel } from '../models/Prioridade.js';
import mongoose from "mongoose";
import { validarObjetoId } from "../services/validarObjectId.js";
import { buscarPrioridadeId } from "../services/prioridadeService.js";

export const criarObjetivo = async (req: Request, res: Response): Promise<void> => {
    try {
        //1. Extrair corpo da requisição
        const { prioridadeId, nome, descricao } = req.body;

        //2.Validar os dados recebidos:
        if (!prioridadeId || typeof nome !== 'string' || !nome.trim()) {
            res.status(400).json({
                success: false,
                message: 'Prioridade id e nome são obrigatórios'
            });
            return;
        }

        if (descricao !== undefined && typeof descricao !== 'string') {
            res.status(404).json({
                success: false,
                message: 'Descrição deve ser uma string'
            })
            return;
        }

        //3.Validar formato
        if (!validarObjetoId(prioridadeId)) {
            res.status(400).json({
                success: false,
                message: 'id prioridade não é valido'
            })
            return;
        }

        //Busca prioridadeId no banco
        const prioridade = await buscarPrioridadeId(prioridadeId);
        if(!prioridade){
            res.status(404).json({
                success: false,
                message: 'PrioridadeId não não encontrado'
            })
            return;
        }        
        //4. Criar o novo objetivo:
        const novo_objetivo = await ObjetivoModel.create({ prioridadeId, nome, descricao });
        res.status(201).json({
            success: true,
            message: 'Objetivo criado com sucesso',
            objetivo: novo_objetivo
        })

    } catch (error) {
        console.log('Erro ao salvar novo objetivo', error);
        res.status(500).json({
            erro: 'Erro ao salvar novo objetivo'
        })
    }
};

export const listarObjetivosPorPrioridade = async (req: Request, res: Response): Promise<void> => {
    try {
        //1. Extrair prioridadeId
        const { prioridadeId } = req.params;

        //2. Validar o formato
        if (!prioridadeId) {
            res.status(400).json({
                success: false,
                message: 'Prioridade id é obrigatório'
            })
            return;
        }

        //2. Validar prioridadeId
        if(!validarObjetoId(prioridadeId)){
            res.status(400).json({
                success:false,
                message:'Prioridade id não é válido'
            })
            return;
        }

        //3. Consultar prioridade id
        const prioridade = await buscarPrioridadeId(prioridadeId);
        if(!prioridade){
            res.status(404).json({
                success:false,
                message:'Prioridade não encontrada'
            })
            return
        }
        
        const objetivos = await ObjetivoModel
        .find({
            prioridadeId: prioridadeId
        })
        .sort({createdAt: -1});
        res.status(200).json({
            success:true,
            objetivos: objetivos
        });

    } catch (error) {
        console.log('Erro ao listar objetivos', error);
        res.status(500).json({
            erro: 'Erro ao listar objetivos'
        })
    }
};