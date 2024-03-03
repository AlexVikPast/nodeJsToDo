import { Router } from "express";
import { mainPage, detailPage } from "./contollers/todos.js"; 

const router = Router();

router.post('/', detailPage);

router.get('/:id', detailPage);
router.get('/', mainPage);

export default router;