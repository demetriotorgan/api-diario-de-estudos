import test from 'node:test'
import type { Request, Response } from 'express';
import assert from 'node:assert';

import {criarObjetivo} from '../src/controllers/ObjetivoControllers.js'

test('deve retornar HTTP 400 quando nome estiver ausente', async ()=>{
    //1.Simular a requisição
    const req = {
        body:{
            prioridadeId: '6ae642462f6000d2265eca05',
            descricao: 'Teste sem nome'
        }
    } as Request;

    //2. Preparar captura da resposta
    let statusRecebido = 0;
    let corpoRecebido: unknown;

    const res = {
        status(codigo:number){
            statusRecebido = codigo;
            return this;
        },
        json(dados: unknown){
            corpoRecebido = dados;
            return this;
        }
    } as Response;

    //3. Executar o controller
    await criarObjetivo(req,res);

    //4. Verifica o resultado
    assert.equal(statusRecebido, 400);

    assert.deepEqual(corpoRecebido, {
        success:false,
        message: 'Prioridade id e nome são obrigatórios'
    })
})