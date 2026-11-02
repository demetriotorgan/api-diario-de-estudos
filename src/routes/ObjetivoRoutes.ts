import { Router } from 'express'
import { criarObjetivo, listarObjetivosPorPrioridade } from '../controllers/ObjetivoControllers.js';
import { concluirObjetivo } from '../controllers/RegistroExecucaoControllers.js';

const router = Router();

router.post('/salvar', criarObjetivo);
router.get('/:prioridadeId/listar', listarObjetivosPorPrioridade);
router.patch('/:objetivoId/concluir',concluirObjetivo);

export default router;

