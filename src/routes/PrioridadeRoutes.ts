import {Router} from 'express'
import {criarPrioridade, desativarPrioridade, listarPrioridades, listarPrioridadesComObjetivos} from '../controllers/PrioridadeController.js'

const router = Router();

router.post('/salvar', criarPrioridade);
router.get('/listar', listarPrioridades);
router.patch('/:id/desativar', desativarPrioridade);
router.get('/objetivos', listarPrioridadesComObjetivos);

export default router;