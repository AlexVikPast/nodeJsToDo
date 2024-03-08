import { Router, urlencoded } from "express";
import methodOverride from "method-override";
import { mainPage, detailPage, addPage, add, setDone, remove, setNotDone } from "./contollers/todos.js"; 

const router = Router();

router.use(urlencoded({extended: true}));
router.use(methodOverride('_method'));

router.get('/add', addPage);
router.post('/add', add);

router.put('/:id', setDone);
// router.put('/done/:id', setNotDone);
router.delete('/:id', remove);

router.get('/:id', detailPage);
router.get('/', mainPage);

export default router;