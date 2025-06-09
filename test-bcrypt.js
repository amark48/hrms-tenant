import { hash, compareSync } from 'bcrypt';

// Replace these with your actual values.
const plainPassword = '3>A=r8DI?I^6<xi>'; // The password you want to test.
const hashedPassword = '$2b$10$JaafiL3Hb/8dyXsxtH4bhe7Rdzd3EUvqrWezr2Ohy.FUhXE8k3NvO'; // The hash stored in your DB.
const hashedPassworD = '$2b$10$/OIMjRRPkHD80.WAALspA.JGukfwVMH3W3szjpZ0CZ9dNlZJ3dW16'
const testPlain = "z6HQr*GhQ]WA^EI0";
const testHash = await hash(testPlain, 10);
console.log(compareSync(plainPassword, hashedPassworD)); // Should log true.
//console.log("Here is the hashed value: ", testHash);

/*
bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
  if (err) {
    console.error("Error comparing passwords:", err);
    return;
  }
  console.log("Password match result:", result); // This will print 'true' if they match, otherwise 'false'.
}); */
