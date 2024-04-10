import { database, saveDatabase, getObjectId } from "./__loaddatabase.js";

const users = database.users;

// export function getUser(name) {
//   return users.find((el) => el.username === name);
// }

// export function addUser(user) {
//   user._id = getObjectId();
//   users.push(user);
//   saveDatabase();
// }

import { User } from "./__loaddatabase.js";

export async function getUser(name) {
  return await User.findOne({username: name});
}

export async function addUser(user) {
  const oUser = new User(user);
  await oUser.save();
}