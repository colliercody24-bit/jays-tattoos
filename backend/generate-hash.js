// Run this script to generate a password hash for your admin account
// Usage: node generate-hash.js your-password

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
    console.error('Please provide a password as an argument');
    console.error('Usage: node generate-hash.js your-password');
    process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

console.log('\n=== Password Hash Generated ===');
console.log(`\nAdd this to your .env file:\n`);
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log('\n');
