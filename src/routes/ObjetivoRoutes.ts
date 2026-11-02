import { Router } from 'express'
import { concluirObjetivo, criarObjetivo, excluirObjetivo, listarObjetivosPorPrioridade } from '../controllers/ObjetivoControllers.js';


const router = Router();

router.post('/salvar', criarObjetivo);
router.get('/:prioridadeId/listar', listarObjetivosPorPrioridade);
router.patch('/:objetivoId/concluir',concluirObjetivo);
router.delete('/:objetivoId/deletar', excluirObjetivo);

export default router;

