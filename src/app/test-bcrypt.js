const bcrypt = require('bcrypt');

// Replace these with your actual values.
//const plainPassword = 'zB@V(-J=Z0j(as[f'; // The password you want to test.
//const hashedPassword = '$2b$10$onJwZF26wMcVnYBwBQa4HOoPpgDrBgBE9.gRU23S5ugvWzWBoDM0S'; // The hash stored in your DB.

const testPlain = "Password123!";
const testHash = await bcrypt.hash(testPlain, 10);
console.log(bcrypt.compareSync(testPlain, testHash)); // Should log true.

/*
bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
  if (err) {
    console.error("Error comparing passwords:", err);
    return;
  }
  console.log("Password match result:", result); // This will print 'true' if they match, otherwise 'false'.
});
*/