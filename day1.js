// day1.js- testing node runtime environment and event loop behavior

//check environmental properties
console.log('--- Environment Check ---');
console.log('Current directory:', __dirname);
console.log('File path:', __filename);
console.log('OS platform:', process.platform);
console.log('Process ID:', process.pid);

console.log('\n--- Execution Order Test ---');

console.log('1. Initiating database connection sequence...');
setTimeout(() => {
    console.log('3. Async database query completed.');
}, 2000);

console.log('2. Main thread completely clear to handle incoming requests.');


