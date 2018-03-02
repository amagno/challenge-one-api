

// class User {
//   constructor(
//     name,
//     email,
//     password,
//     birthDate,
//     workLoad,
//     phone = undefined,
//     scholarity = undefined,
//   ) {
//     this.name = name;
//     this.email = email;
//     this.password = password;
//     this.birthDate = birthDate;
//     this.workLoad = workLoad;
//     this.phone = phone;
//     this.scholarity = scholarity;
//   }
// }

const validateAndCreateObject = (object, keys = []) => {
  keys.forEach((key) => {
    if (!object[key]) {
      throw new Error(`Object not valid its not give key: ${key}`);
    }
  });
  return Object.assign({}, object);
};

const verifyExists = (db, property) => new Promise((resolve, reject) => {
  db.findOne(property).exec((err, doc) => {
    if (err) { reject(err); }
    if (doc) {
      resolve(true);
    }
    resolve(false);
  });
});

const verifyExistsArray = async (db, propertyName, arrayValues) => {
  const verifyArray = await Promise.all(arrayValues.map(value => new Promise(async (resolve) => {
    const query = {};
    query[propertyName] = value;
    const exist = await verifyExists(db, query);
    resolve(exist);
  })));
  return verifyArray.includes(false);
};

module.exports = {
  validateAndCreateObject,
  verifyExists,
  verifyExistsArray,
};
