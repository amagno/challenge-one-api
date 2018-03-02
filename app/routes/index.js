const api = require('../api');
const jwtMiddleware = require('express-jwt');
const jwtSecret = require('../../config/secret');

const withUrlPrefix = url => `/api${url}`;


module.exports = (app) => {
  app.use(withUrlPrefix('/'), jwtMiddleware({ secret: jwtSecret }).unless({
    path: [withUrlPrefix('/login')],
  }));
  app.use(withUrlPrefix('/'), (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ success: false, message: 'Unauthorized token' });
    }
    return next();
  });

  app.route(withUrlPrefix('/'))
    .get(api.home);

  // usuários
  app.route(withUrlPrefix('/login'))
    .post(api.users.login);

  app.route(withUrlPrefix('/users'))
    .post(api.users.insert)
    .get(api.users.list);

  app.route(withUrlPrefix('/users/:identifier'))
    .delete(api.users.remove)
    .get(api.users.get)
    .put(api.users.update);

  // projetos
  app.route(withUrlPrefix('/projects'))
    .post(api.projects.insert)
    .get(api.projects.list);

  app.route(withUrlPrefix('/projects/:identifier'))
    .delete(api.projects.remove)
    .get(api.projects.get)
    .put(api.projects.update);

  // not found
  app.all('*', (req, res) => {
    res.redirect(withUrlPrefix('/'));
  });
};
