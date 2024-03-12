import { Router, urlencoded, static as staticMiddleware } from "express";
import methodOverride from "method-override";
import { mainPage, detailPage, addPage, add, setDone, remove } from "./contollers/todos.js"; 
import { requestToContext, handlerErrors } from "./middleware.js";
import { todoV } from "./validators.js"; 
import { mainErrorHandler, error500Handler } from "./error-handlers.js";

const router = Router();

router.use(urlencoded({ extended: true, limit: 1 }));
router.use(methodOverride('_method'));

router.use(requestToContext);
router.use(staticMiddleware('public'));

router.get('/add', addPage);
// router.post('/add', add);
router.post('/add', todoV, handlerErrors, add)

router.put('/:id', setDone);
router.delete('/:id', remove);

router.get('/:id', detailPage);
router.get('/', mainPage);

router.use(mainErrorHandler, error500Handler);

export default router;