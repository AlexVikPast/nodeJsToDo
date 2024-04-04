import { randomBytes } from 'node:crypto';

import { pbkdf2Promisified } from '../utility.js';
import { addUser } from '../models/users.js';

export function registrPage(req, res) {
  res.render('register', { title: 'Регистрация' })
}

export async function register(req, res) {
  const salt = randomBytes(16);
  const hash = await pbkdf2Promisified(req.body.password, salt, 100000, 32, 'sha256');

  const user = {
    username: req.body.username,
    password: hash,
    salt: salt
  };

  addUser(user);
  res.redirect('/');
}