import { Router } from "express";
import { deletarRegistroExecucao, listarRegistroExecucao, registroExecucaoControllers } from "../controllers/RegistroExecucaoControllers.js";

const router = Router();

router.post('/:prioridadeId/salvar', registroExecucaoControllers);
router.get('/listar', listarRegistroExecucao);
router.delete('/:execucaoId/deletar', deletarRegistroExecucao);


export default router;