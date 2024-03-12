import { matchedData, validationResult } from "express-validator";

export function requestToContext(req, res, next) {
  res.locals.req = req;
  next();
}

export function handlerErrors(req, res, next) {
  const r = validationResult(req);

  console.log(r);

  if (!r.isEmpty()) {
    res.redirect('back');
  } else {
    req.body = matchedData(req);
    next();
  }
}