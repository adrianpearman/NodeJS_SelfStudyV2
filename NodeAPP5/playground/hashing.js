const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')


let data = {
  id: 4
}

// --- Example #1 ---//
//--- USING SHA256 ---//
// let message = 'i am user 29292';
// let hash = SHA256(message).toString();
// let hash2 = SHA256(hash).toString();
//
// console.log(message);
// console.log(hash);
// console.log(hash2);
//
// let token = {
//   data: data,
//   // the hash value of the data object
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()
//
// if (resultHash === token.hash) {
//   console.log('data is the same');
// }else {
//   console.log('data was changed');
// }


//--- Example 2 ---//
//--- Using JSON WEB TOKEN --///
let token = jwt.sign(data, '123abc')
console.log(token);

let decoded = jwt.verify(token, '123abc')
console.log(decoded);


//--- BCRYPTJS ---//
let password = '123abc!';
let hashPassword = '$2a$10$OsC3VT/dEXvVaPM0mG6xLuPSxN6o3u6FQVUL3jBzW48vlqUDMWFp2'

//The argument is amount of rounds of the salt value.
bcrypt.genSalt(10, (error, salt) => {
  bcrypt.hash(password, salt, (error, hash) => {
    console.log(hash);
  })
})

// unencrypts the values of the encrypted password and returns boolean
bcrypt.compare(password, hashPassword, (error, res) => {
  console.log(res);
})
