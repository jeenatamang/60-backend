// testing external npm packages
const { v4: uuidv4 } = require('uuid');

// generate a secure random id
const uniqueId = uuidv4();

console.log('generated secure id:', uniqueId);

