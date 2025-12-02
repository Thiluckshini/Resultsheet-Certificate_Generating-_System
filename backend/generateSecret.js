// backend/generateSecret.js

const crypto = require('crypto');

// Generate a random secret key of 64 bytes
const secretKey = crypto.randomBytes(64).toString('hex');

// Log the secret key to the console
console.log(secretKey);
