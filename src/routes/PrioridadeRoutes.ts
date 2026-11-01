import {Router} from 'express'
import {criarPrioridade, desativarPrioridade, listarPrioridades} from '../controllers/PrioridadeController.js'

const router = Router();

router.post('/salvar', criarPrioridade);
router.get('/listar', listarPrioridades);
router.patch('/:id/desativar', desativarPrioridade);

export default router;