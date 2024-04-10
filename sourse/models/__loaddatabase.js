import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';

import { currentDir } from '../utility.js';

const dataFileName = join(currentDir, 'data', 'todos.json');

const dataFile = readFileSync(dataFileName, 'utf8');
const database = JSON.parse(dataFile);
export { database };

export function saveDatabase() {
  const s = JSON.stringify(database);
  writeFile(dataFileName, s, 'utf8');
}

export function getObjectId() {
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
      return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
};

import { connect, Schema, model } from 'mongoose';

const dbURI = process.env.DBURI || 'mongodb://localhost:27017/';
const dbName = process.env.DBNAME || 'todos';

const scTodo = new Schema({
    title: String,
    desc: String,
    addendum: String,
    user: {
        type: Schema.Types.ObjectId,
        index: true
    },
    done: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        index: true,
        default: () => new Date()
    }
}, {
    versionKey: false,
    statics: {
        async findOneAndSetDone(id, user) {
            const todo = await this.findOne({ _id: id, user: user });
            if (todo)
                await todo.setDone();
            return todo;
        }
    },
    query: {
        contains(val) {
            return this.or([
                { title: new RegExp(val, 'i') },
                { desc: new RegExp(val, 'i') }
            ]);
        }
    }
});
scTodo.index({ done: 1, createdAt: 1 });

scTodo.method('setDone', async function() {
    this.done = !this.done;
    await this.save();
});

const scUser = new Schema({
    username: {
        type: String,
        index: true
    },
    password: Buffer,
    salt: Buffer
}, {
    versionKey: false
});

let User, Todo;

export async function connectToDB() {
    await connect(dbURI, { dbName: dbName });
    Todo = model('Todo', scTodo);
    User = model('User', scUser);
}

export { Todo, User };