// const _ = require('lodash');
const path = require('path');

// const db = require('../../config/database');

const users = require('./users');
const projects = require('./projects');

const home = (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
};

module.exports = {
  home,
  users,
  projects,
};
