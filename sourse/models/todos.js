import { database, saveDatabase, getObjectId } from "./__loaddatabase.js";
import { Todo } from './__loaddatabase.js';

const todos = database.todos;

export async function getList(user, doneAtLast, search) {
  // return todos.filter((el) => el.user === user);
  const qTodos = Todo.find({user: user});
  if (doneAtLast === '1') {
    qTodos.sort('done createdAt');
  } else {
    qTodos.sort('createdAt');
  }
  if (search) {
    qTodos.contains(search);
  }
  return await qTodos;
}

export async function getItem(id, user) {
  // return todos.find((el) => el._id === id && el.user === user);
  return await Todo.findOne({_id: id, user: user});
}


export async function addItem(todo) {
  // todo._id = getObjectId();
  // todos.push(todo);
  // saveDatabase();
  const oTodo = new Todo(todo);
  await oTodo.save();
}

function getItemIndex(id, user) {
  return todos.findIndex((el) => el._id === id && el.user === user);
}

export async function setDoneItem(id, user) {
  // const index = getItemIndex(id, user);
  // if (index > -1) {
  //   todos[index].done = !todos[index].done;
  //   saveDatabase();
  //   return true;
  // } else 
  // return false;

  // const todo = await getItem(id, user);
  // if (todo) {
  //   todo.done = true;
  //   await todo.save();
  //   return true
  // } else {
  //   false;
  // }

  return await Todo.findOneAndSetDone(id, user);

}

export async function deleteItem(id, user) {
  // const index = getItemIndex(id);
  // if (index > -1) {
  //   todos.splice(index, 1);
  //   saveDatabase();
  //   return true;
  // } else
  //   return false;
  return await Todo.findOneAndDelete({ _id: id, user: user});
}

export async function getMostActiveUsers() {
  const result = [];

  result[0] = await Todo.aggregate([
      {
          $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'userObj'
          }
      },
      { $unwind: '$userObj' },
      { $group: { _id: '$userObj.username', cnt: { $count: {} } } },
      { $sort: { cnt: -1 } },
      { $limit: 3 }
  ]);

  result[1] = await Todo.aggregate([
      { $match: { done: true } },
      {
          $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'userObj'
          }
      },
      { $unwind: '$userObj' },
      { $group: { _id: '$userObj.username', cnt: { $count: {} } } },
      { $sort: { cnt: -1 } },
      { $limit: 3 }
  ]);

  return result;
}

