// import { Router, urlencoded, static as staticMiddleware } from "express";

import express from "express";
const { Router, urlencoded, static: staticMiddleware } = express;

import methodOverride from "method-override";
import { mainPage, detailPage, addPage, add, setDone, remove, setOrder, addendumWrapper, mostActiveUsers } from "./contollers/todos.js"; 
import { registrPage, register, loginPage, login, logout } from "./contollers/users.js";
import { requestToContext, handlerErrors, extendFlashAPI, getErrors, loadCurrentUser, isGuest, isLoggedIn } from "./middleware.js";
import { todoV, registerV, loginV } from "./validators.js"; 
import { mainErrorHandler, error500Handler } from "./error-handlers.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import _FileStore from 'session-file-store';
import { flash } from "express-flash-message";

const FileStore = _FileStore(session);

const router = Router();

router.use(cookieParser());
router.use('/uploaded', staticMiddleware('storage/uploaded'));

router.use(session({
  store: new FileStore({
      path: './storage/sessions',
      reapAsync: true,
      reapSyncFallback: true,
      fallbackSessionFn: () => {
          return {};
      },
      logFn: () => {}
  }),
  secret: 'abcdefgh',
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));
router.use(flash({ sessionKeyName: 'flash-message' }));
router.use(extendFlashAPI);
router.use(loadCurrentUser);

router.use(urlencoded({ extended: true, limit: 1 }));
router.use(methodOverride('_method'));

router.use(requestToContext);

// isGuest - Если гость - редиректим на "Главную страницу"
router.get('/register', isGuest, getErrors, registrPage);
router.post('/register', isGuest, registerV, handlerErrors, register);

router.get('/login', isGuest, getErrors, loginPage);
router.post('/login', isGuest, loginV, handlerErrors, login);

router.use(staticMiddleware('public'));

// Проверка вошел ли пользователь в систему
router.use(isLoggedIn);
router.post('/logout', logout);
router.get('/mostactive', mostActiveUsers);

router.get('/add', getErrors, addPage);
router.post('/add', addendumWrapper, todoV, handlerErrors, add)

router.put('/:id', setDone);
router.delete('/:id', remove);
router.post('/setorder', setOrder);

router.get('/:id', detailPage);
router.get('/', mainPage);

router.use(mainErrorHandler, error500Handler);

export default router;