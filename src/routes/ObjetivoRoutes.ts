import { Router } from 'express'
import { criarObjetivo, listarObjetivosPorPrioridade } from '../controllers/ObjetivoControllers.js';

const router = Router();

router.post('/salvar', criarObjetivo);
router.get('/:prioridadeId/listar', listarObjetivosPorPrioridade);

export default router;

