import { Request, Response } from "express";
import { PrioridadeModel } from "../models/Prioridade.js";
import { ObjetivoModel } from "../models/Objetivo.js";
import { validarObjetoId } from "../services/validarObjectId.js";
import { buscarPrioridadeId } from "../services/prioridadeService.js";
import { validarDataRegistro } from "../services/validarDataRegistro.js";
import { buscarObjetivoId } from "../services/objetivoService.js";


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
        if(objetivo.status === 'CONCLUIDO'){
            res.status(409).json({
                success:false,
                message:'Não é permitido registrar uma atividade com registro concluido'
            })
        };


        res.status(200).json({
            success: true,
            message: 'Dados validos'
        })

    } catch (error) {
        console.log('Erro ao salvar novo registro de execução', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao salvar novo registro de execução'
        })
    }
}
