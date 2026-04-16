// index.js - Simple entry point (can be used directly or imported)
const { protokol } = require('./protokol');

/**
 * Protokol logger - simple usage examples:
 * 
 * Basic logging:
 *   protokol('Hello World')
 *   protokol(user, 'User logged in:', timestamp)
 * 
 * Objects are automatically converted to JSON strings:
 *   protokol({ name: 'Alice', action: 'purchase' })
 * 
 * Arrays are logged as comma-separated values:
 *   protokol([1, 2, 3])
 */



module.exports = { protokol };
