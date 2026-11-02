import { Request, Response } from "express";
import { ObjetivoModel } from '../models/Objetivo.js'
import { PrioridadeModel } from '../models/Prioridade.js';
import mongoose from "mongoose";
import { validarObjetoId } from "../services/validarObjectId.js";
import { buscarPrioridadeId } from "../services/prioridadeService.js";
import { buscarObjetivoIdOnly } from "../services/objetivoService.js";
import { RegistroExecucaoModel } from "../models/RegistroExecucao.js";

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
        if (!prioridade) {
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
        if (!validarObjetoId(prioridadeId)) {
            res.status(400).json({
                success: false,
                message: 'Prioridade id não é válido'
            })
            return;
        }

        //3. Consultar prioridade id
        const prioridade = await buscarPrioridadeId(prioridadeId);
        if (!prioridade) {
            res.status(404).json({
                success: false,
                message: 'Prioridade não encontrada'
            })
            return
        }

        const objetivos = await ObjetivoModel
            .find({
                prioridadeId: prioridadeId
            })
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            objetivos: objetivos
        });

    } catch (error) {
        console.log('Erro ao listar objetivos', error);
        res.status(500).json({
            erro: 'Erro ao listar objetivos'
        })
    }
};

export const concluirObjetivo = async (req: Request, res: Response): Promise<void> => {
    try {
        //1.Receber objetivoId
        const { objetivoId } = req.params;
        //console.log('ObjetivoId recebido:', objetivoId);

        //2. Validar id
        if (!objetivoId) {
            res.status(400).json({
                success: false,
                message: 'Objetivo Id não enviado'
            })
            return;
        };

        if (!validarObjetoId(objetivoId)) {
            res.status(400).json({
                success: false,
                message: 'Objetivo ID não é valido'
            })
            return;
        };

        const objetivo = await buscarObjetivoIdOnly(objetivoId);
        //console.log('Objetivo encontrado:', objetivo);
        if (objetivo === null) {
            res.status(404).json({
                success: false,
                message: 'Objetivo não encontrado'
            })
            return;
        };
        //Se objetivo ja concluido 409
        if (objetivo.status === 'CONCLUIDO') {
            res.status(409).json({
                success: false,
                message: 'Objetivo já está concluido'
            })
            return;
        };

        if (objetivo.status === 'NAO_INICIADO') {
            res.status(409).json({
                success: false,
                message: 'Objetivo ainda não iniciado'
            });
            return;
        }

        //salvando 
        const objetivo_concluido = await ObjetivoModel.findOneAndUpdate(
            {
                _id: objetivoId,
                status: 'EM_ANDAMENTO'
            },
            {
                $set: { status: 'CONCLUIDO' }
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        )
        if (!objetivo_concluido) {
            res.status(404).json({
                success: false,
                message: 'Objetivo não encontrado'
            })
            return;
        };

        res.status(200).json({
            success: true,
            message: 'Objetivo concluido com sucesso',
            objetivo: objetivo_concluido
        })

    } catch (error) {
        console.error('Erro ao concluir objetivo: ', error);
        res.status(500).json({
            success: false,
            erro: 'Erro ao concluir objetivo'
        })
    }
};

export const excluirObjetivo = async (req: Request, res: Response): Promise<void> => {
    try {
        //1. Extrair objetivoId de req.params
        const { objetivoId } = req.params;

        if (!objetivoId || typeof objetivoId !== 'string') {
            res.status(400).json({
                success: false,
                message: 'Objetivo id não enviado'
            })
            return;
        }

        //2. Validar formato do objetivoId
        const idValido = validarObjetoId(objetivoId);
        if (!idValido) {
            res.status(400).json({
                success: false,
                message: 'Objetivo id não é valido'
            })
            return;
        }

        //3. Consultar ObjetivoModel.findById(objetivoId)
        const objetivo_alvo = await buscarObjetivoIdOnly(objetivoId);
        if (!objetivo_alvo) {
            res.status(404).json({
                success: false,
                message: 'Objetivo não encontrado'
            })
            return;
        }
        //4. Consultar RegistroExecucaoModel.exists({objetivoId})
        const possuiRegistros = await RegistroExecucaoModel.exists({ objetivoId })
        if (possuiRegistros) {
            res.status(409).json({
                success: false,
                message: 'Objetivo possui registros de execução associados e não pode ser excluído'
            })
            return;
        };

        //5. Excluir o objetivo
        const objetivo_deletado = await ObjetivoModel.findByIdAndDelete({ _id: objetivoId })
        if (!objetivo_deletado) {
            res.status(404).json({
                success: false,
                message: 'Objetivo não encontrado no momento da exclusão'
            });
            return;
        }
        //6. RETORNAR HTTP 200

        res.status(200).json({
            success: true,
            message: 'Objetivo excluido com sucesso',
            objetivo: objetivo_deletado
        });
    } catch (error) {
        console.log('Erro ao excluir objetivo: ', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao excluir objetivo'
        })
    }
};

