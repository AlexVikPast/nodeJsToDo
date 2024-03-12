import express, { urlencoded }  from "express";

import './sourse/models/__loaddatabase.js';
import router from "./sourse/routes.js";
import { aboutMe } from "./sourse/contollers/about.js";

const port = 8000;
const app = express();
app.use(urlencoded({extended: true}));

app.set('strict routing', false); // Включение не строго соответсвия путей

app.get(['/about', '/about_me'], aboutMe);
app.use('/', router);

app.set('view engine', 'ejs');
app.set('views', './sourse/templates');

app.locals.appTitle = 'Express';

app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}/`)
});
