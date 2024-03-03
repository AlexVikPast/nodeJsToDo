import { database } from "./__loaddatabase.js";

const todos = database.todos;

export function getList() {
  return todos;
}

export function getItem(id) {
  return todos.find((el) => el._id === id);
}
