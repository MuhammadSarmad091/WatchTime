const bcrypt = require('bcrypt');
const password = 'admin';

console.log("Here");
bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});
