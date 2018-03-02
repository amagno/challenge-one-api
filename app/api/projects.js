// projetos
// const db = require('nedb');
const db = require('../../config/database');
const utils = require('./utils');
const moment = require('moment');

const projects = {};

const DATE_FORMAT = 'DD/MM/YYYY';

projects.list = (req, res) => {
  const search = req.query;
  const limit = (search.limit) ? parseInt(search.limit, 10) : 10;
  const skip = (search.page) ? parseInt(search.page, 10) - 1 : 0;
  const sort = { name: 1 };

  delete search.page;
  delete search.limit;

  Object.keys(req.query).forEach((key) => {
    search[key] = new RegExp(req.query[key], 'i');
  });

  db.projects.find(search).skip(skip * limit).limit(limit).sort(sort)
    .exec((err, doc) => {
      if (err) { res.status(500).json({ success: false, message: err }); }
      res.json(doc);
    });
};

projects.insert = async (req, res) => {
  try {
    const project = utils.validateAndCreateObject(req.body, [
      'name',
      'start',
      'finish',
    ]);

    // const bossId = req.user._id;
    // const bossAlreadyProject = await utils.verifyExists(db.projects, { boss: bossId });

    // if (bossAlreadyProject) {
    //   return res.status(400).json({ success: false, message: 'Boss already belongs to project' });
    // }
    // const bossExists = await utils.verifyExists(db.users, { _id: project.boss });
    const existTeam = await utils.verifyExistsArray(db.users, '_id', project.team);

    if (existTeam) {
      return res.status(400).json({ success: false, message: 'Team are menbers invalid!' });
    }

    const start = moment(project.start, DATE_FORMAT);
    const finish = moment(project.finish, DATE_FORMAT);

    if (!start.isValid() || !finish.isValid()) {
      return res.status(400).json({ success: false, message: 'Dates are invalid!' });
    }
    console.log(start.format(DATE_FORMAT));
    // console.log(project.finish);
    console.log(finish.format(DATE_FORMAT));

    project.team.forEach((userId) => {
      db.projects.find({ team: [userId] }).exec((err, doc) => {
        doc.forEach((p) => {
          const startDateCheck = start.isBetween(moment(p.start, DATE_FORMAT), moment(p.finish, DATE_FORMAT))
          || moment(p.start, DATE_FORMAT).isSame(start);
          const finishDateCheck = finish.isBetween(moment(p.start, DATE_FORMAT), moment(p.finish, DATE_FORMAT))
          || moment(p.finish, DATE_FORMAT).isSame(finish);

          console.log(startDateCheck);
          console.log(finishDateCheck);
        });
      });
    });

    // team.forEach(async (userId) => {
    //   // console.log(userId);
    //   const exists = await utils.verifyExists(db.users, { _id: userId });
    //   if (!exists) {
    //     return res.status(400).json({ success: false, message: `User ${userId} not exists` });
    //   }
    //   return userId;
    // });

    // console.log(project);

    // delete project._id;
    // db.projects.insert(project, (err, newDoc) => {
    //   if (err) { res.status(500).json({ success: false, message: err }); }

    //   // console.log(`${newDoc._id} success written`);
    //   res.json(newDoc);
    // });
    res.json(project);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

projects.update = (req, res) => {
  if (!req.params.identifier) { return res.json({ success: false, message: 'parameter identifier can not be null' }); }

  db.projects.update({ _id: req.params.identifier }, req.body, (err, numReplaced) => {
    if (err) { return res.json({ success: false, message: err }); }

    if (numReplaced) { res.status(200).json({ success: true, message: `${req.params.identifier} success updated` }); }

    res.status(500).end({ success: false, message: `can not find project ${req.params.identifier}` });
  });
};

projects.remove = (req, res) => {
  if (!req.params.identifier) { return res.json({ success: false, message: 'parameter identifier can not be null' }); }

  db.projects.remove({ _id: req.params.identifier }, { multi: false }, (err, numRemoved) => {
    if (err) { res.status(500).json({ success: false, message: err }); }

    if (numRemoved) { res.status(200).json({ success: true, message: `${req.params.identifier} success removed` }); }

    res.status(500).json({ success: false, message: `can not find project ${req.params.identifier}` });
  });
};

projects.get = (req, res) => {
  if (!req.params.identifier) { res.json({ success: false, message: 'parameter identifier can not be null' }); }

  db.projects.findOne({ _id: req.params.identifier }, (err, doc) => {
    if (err) { res.json({ success: false, message: err }); }

    if (!doc) { res.json({ success: false, message: 'Project can not be found. Maybe the identifier is wrong!' }); }

    res.json(doc);
  });
};

module.exports = projects;
