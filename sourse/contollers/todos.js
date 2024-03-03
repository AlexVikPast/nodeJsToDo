import { getList, getItem } from "../models/todos.js"; 

export function mainPage(req, res) {
  res.render('main', {
      todos: getList(),
      title: "Главная"
    }
  );
}

export function detailPage(req, res) {
  const t = getItem(req.params.id);
  if (!t) {
      errorPage(req, res);
      return;
  }

  res.render('detail', {
    todo: t,
    title: t.title
  });
}

function errorPage(req, res) {
  res.render('404', {
    title: "Ошибка"
  });
}