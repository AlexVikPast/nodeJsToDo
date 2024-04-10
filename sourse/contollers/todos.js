import { join } from "node:path";
import { rm } from "node:fs/promises";
import createError from 'http-errors';

import { getList, getItem, addItem, setDoneItem, deleteItem, getMostActiveUsers } from '../models/todos.js';
import { currentDir } from "../utility.js";

import { addendumUploader } from '../uploaders.js';
import { throws } from "node:assert";

// export function mainPage(req, res) {
//     let list = getList(req.user.id);

//     if (req.cookies.doneAtLast === '1') {
//         list = [...list];
//         list.sort((el1, el2) => {
//             const date1 = new Date(el1.createdAt);
//             const date2 = new Date(el2.createdAt);
//             const done1 = el1.done || false;
//             const done2 = el2.done || false;
//             const doneDiff = done1 - done2;
//             if (doneDiff != 0)
//                 return doneDiff;
//             else
//                 return date1 - date2;
//         });
//     }

//     if (req.query.search) {
//         const q = req.query.search.toLowerCase();
//         list = list.filter((el) => {
//             if (el.title.toLowerCase().includes(q))
//                 return true;
//             else
//                 if (el.desc)
//                     return el.desc.toLowerCase().includes(q);
//                 else
//                     return false;
//         });
//     }

//     res.render('main', {
//         todos: list,
//         title: 'Главная'
//     });
// }

export async function mainPage(req, res) {
    const list = await getList(req.user.id, req.cookies.doneAtLast, req.query.search);
    res.render('main', {
        todos: list,
        title: 'Главная'
    });
}

// export function detailPage(req, res) {
//     const t = getItem(req.params.id, req.user.id);

//     if (!t)
//         throw createError(404, 'Запрошенное дело не существует');

//     res.render('detail', {
//         todo: t,
//         title: t.title
//     });
// }

export async function detailPage(req, res) {

    console.log(req.params);
    console.log(req.user);

    try {
        const t = await getItem(req.params.id, req.user.id);

        res.render('detail', {
            todo: t,
            title: t.title
        });

    } catch (err) {
        next(err)
    }
}

export function addPage(req, res) {
    res.render('add', { title: 'Добавление дела' });
}

export function addendumWrapper(req, res, next) {
    addendumUploader(req, res, (err) => {
        if (err)
            if (err.code == 'LIMIT_FILE_SIZE') {
                req.errorObj = {
                    addendum: {
                        msg: 'Допускаются лишь файлы размером ' +
                             'не более 100 Кбайт'
                    }
                };
                next();
            } else
                next(err);
        else
            next();
    });
}

// export function add(req, res) {
//     const todo = {
//         title: req.body.title,
//         desc: req.body.desc || '',
//         user: req.user.id,
//         createdAt: (new Date()).toString()
//     };
//     if (req.file)
//         todo.addendum = req.file.filename;
//     addItem(todo);
//     res.redirect('/');
// }

export async function add(req, res) {
    const todo = {
        title: req.body.title,
        desc: req.body.desc,
        user: req.user.id
    };
    if (req.file)
        todo.addendum = req.file.filename;
    await addItem(todo);
    res.redirect('/');
}

// export function setDone(req, res) {
//     if (setDoneItem(req.params.id, req.user.id))
//         res.redirect('/');
//     else
//         throw createError(404, 'Запрошенное дело не существует');
// }

export async function setDone(req, res, next) {
    try {
        if (await setDoneItem(req.params.id, req.user.id)) {
            res.redirect('/');
        } else {
            throw createError(404, 'Запрошенное дело не существует');
        } 
    } catch(err) {
        next(err);
    }
}

// export async function remove(req, res, next) {
//     try {
//         const t = getItem(req.params.id, req.user.id);
//         if (!t)
//             throw createError(404, 'Запрошенное дело не существует');
//         if (t.addendum)
//             await rm(join(currentDir, 'storage', 'uploaded',
//                                                  t.addendum));
//         deleteItem(t._id, req.user.id);
//         res.redirect('/');
//     } catch (err) {
//         next(err);
//     }
// }


export async function remove(req, res, next) {
    try {
        const t = await deleteItem(req.params.id, req.user.id);
        if (!t)
            throw createError(404, 'Запрошенное дело не существует');
        if (t.addendum)
            await rm(join(currentDir, 'storage', 'uploaded',
                                                 t.addendum));
        res.redirect('/');
    } catch (err) {
        next(err);
    }
}

export function setOrder(req, res) {
    res.cookie('doneAtLast', req.body.done_at_last);
    res.redirect('/');
}

export async function mostActiveUsers(req, res) {
    const r = await getMostActiveUsers();
    res.render('most-active', {
        title: 'Самые активные пользователи',
        mostActiveAll: r[0],
        mostActiveDone: r[1]
    });
}