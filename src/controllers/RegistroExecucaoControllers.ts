import { Request, Response } from "express";
import { PrioridadeModel } from "../models/Prioridade.js";
import { ObjetivoModel } from "../models/Objetivo.js";
import { validarObjetoId } from "../services/validarObjectId.js";
import { buscarPrioridadeId } from "../services/prioridadeService.js";
import { validarDataRegistro } from "../services/validarDataRegistro.js";
import { buscarObjetivoId, buscarObjetivoIdOnly } from "../services/objetivoService.js";
import { RegistroExecucaoModel } from "../models/RegistroExecucao.js";
import mongoose from "mongoose";

class ObjetivoNaoDisponivelError extends Error {
    constructor() {
        super('O objetivo não está disponivel para novos registros');
        this.name = 'ObjetivoNaoDisponivelError';
    }
};

export const RegistroExecucaoControllers = async (req: Request, res: Response): Promise<void> => {
    try {
        //1.Extrair body
        const {
            prioridadeId,
            objetivoId,
            data,
            atividade,
            duracaoMinutos,
            statusExecucao,
            esforco,
            observacao } = req.body
        //2. Verificar a existencia dos campos obrigatorios
        if (
            !prioridadeId ||
            !objetivoId ||
            !data ||
            atividade == undefined ||
            atividade == null ||
            duracaoMinutos == null ||
            statusExecucao == undefined ||
            statusExecucao == null
        ) {
            res.status(400).json({
                success: false,
                message: 'Todos os campos obrigatórios devem ser preenchidos'
            })
            return;
        }

        //3.Validando duracaoMinutos 
        if (typeof duracaoMinutos !== 'number' || !Number.isFinite(duracaoMinutos) || duracaoMinutos < 0) {
            res.status(400).json({
                success: false,
                message: 'A duração deve ser um numero valido maior ou igual a zero'
            })
            return;
        };

        //esforco
        if (esforco !== undefined && (typeof esforco !== 'number' || !Number.isInteger(esforco) || esforco < 1 || esforco > 5)) {
            res.status(400).json({
                success: false,
                message: 'O esforço deve ser um número inteiro entre 1 e 5'
            });
            return;
        }

        //Validando atividade
        if (typeof atividade !== 'string' || atividade.trim().length == 0) {
            res.status(400).json({
                success: false,
                message: 'A atividade deve ser um string não vazia'
            })
            return;
        };

        //validando execução
        const statusPermitidos = [
            'SEM_AVANCO',
            'AVANCO_PEQUENO',
            'AVANCO_SIGNIFICATIVO',
            'CONCLUIDA'
        ];

        if (!statusPermitidos.includes(statusExecucao)) {
            res.status(400).json({
                success: false,
                message: 'Status de execucação inválido'
            });
            return;
        };

        //validando observacao
        if (observacao !== undefined && typeof observacao !== 'string') {
            res.status(400).json({
                success: false,
                message: 'A observação deve ser uma string'
            })
            return;
        };

        //validando prioridadeId
        if (!validarObjetoId(prioridadeId)) {
            res.status(400).json({
                success: false,
                message: 'id prioridade não é valido'
            })
            return;
        };

        //validando objetivoId
        if (!validarObjetoId(objetivoId)) {
            res.status(400).json({
                success: false,
                message: 'id objetivo não é valido'
            })
            return;
        };

        //validando data
        if (!validarDataRegistro(data)) {
            res.status(400).json({
                success: false,
                message: 'Tipo de data inválido'
            })
            return;
        };

        //verificar se a prioridade existe
        const prioridade = await buscarPrioridadeId(prioridadeId);
        if (!prioridade) {
            res.status(404).json({
                success: false,
                message: 'prioridade não existente'
            })
            return;
        };

        //verificar se objetivo existe
        const objetivo = await buscarObjetivoId(objetivoId, prioridadeId);
        if (!objetivo) {
            const objetivoExistente = await ObjetivoModel.exists({
                _id: objetivoId
            });

            if (objetivoExistente) {
                res.status(409).json({
                    success: false,
                    message: 'O objetivo não pertence a prioridade informada'
                })
                return;
            }
            res.status(404).json({
                success: false,
                message: 'Objetivo não encontrado'
            });
            return;
        };

        //impedir registros em objetivos concluidos
        console.log(objetivo);
        if (objetivo.status === 'CONCLUIDO') {
            res.status(409).json({
                success: false,
                message: 'Não é permitido registrar uma atividade com registro concluido'
            })
            return;
        };


        //Transaction - Salvando registro de execução
        const novo_registroExecucao = await mongoose.connection.transaction(
            async (session) => {
                //1. Atualizar condicionalmente o objetivo:
                const objetivoAtualizado = await ObjetivoModel.findOneAndUpdate(
                    {
                        _id: objetivoId,
                        prioridadeId,
                        status: {
                            $in: ['NAO_INICIADO', 'EM_ANDAMENTO']
                        }
                    },
                    {
                        $set: {
                            status: 'EM_ANDAMENTO'
                        }
                    },
                    {
                        session,
                        returnDocument: 'after',
                        runValidators: true
                    }
                );

                //2. Não permitir registro se o objetivo não estiver elegivel
                if (!objetivoAtualizado) {
                    throw new ObjetivoNaoDisponivelError();
                }              

                //3. Criar o registro dentro da mesma transação
                const registro = new RegistroExecucaoModel({
                    prioridadeId,
                    objetivoId,
                    data,
                    atividade,
                    duracaoMinutos,
                    statusExecucao,
                    esforco,
                    observacao
                });
                await registro.save({ session })
                return registro;
            }
        );

        res.status(201).json({
            success: true,
            message: 'Registro de execucação salvo com sucesso',
            registro_execucao: novo_registroExecucao
        })

    } catch (error) {
        if (error instanceof ObjetivoNaoDisponivelError) {
            res.status(409).json({
                success: false,
                message: error.message
            });
            return;
        }
        console.log('Erro ao salvar novo registro de execução', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao salvar novo registro de execução'
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
}