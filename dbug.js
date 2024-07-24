// debug.js
if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
  }
  
  const password = process.argv[2];
  const name = process.argv[3];
  const number = process.argv[4];
  
  console.log(`Password: ${password}`);
  console.log(`Name: ${name}`);
  console.log(`Number: ${number}`);
  