console.log('starting app..');

// loads th file system module
const fs = require('fs');
// loads the OS module for operating system
const os = require('os');
// loads in the files from the notes.js file
const notes = require('./notes')


let user = os.userInfo();
console.log(user.username);

let result = notes.addNote()
console.log(result);

let add = notes.addition(3, 10)
console.log(`Results: ${add}`);

// appendfile creates a file, asking for two variables; the first being the name and the second bering the content
fs.appendFile('greeting.txt', `Hello ${user.username}! You are not ${notes.age}`)
