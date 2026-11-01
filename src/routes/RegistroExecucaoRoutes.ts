import { Router } from "express";
import { RegistroExecucaoControllers } from "../controllers/RegistroExecucaoControllers.js";

const router = Router();

router.post('/:prioridadeId/salvar', RegistroExecucaoControllers);

export default router;