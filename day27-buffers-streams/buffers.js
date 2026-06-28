
const buf1 = Buffer.from('Hello Sandesh');
console.log('Buffer:', buf1);
console.log('As string:', buf1.toString());
console.log('Length in bytes:', buf1.length);
console.log('');

const buf2 = Buffer.alloc(10);
console.log('Empty buffer:', buf2);
console.log('');

buf2.write('Hi!');
console.log('After writing:', buf2.toString());
console.log('');

const buf3 = Buffer.from('Hello', 'utf8');
console.log('As hex:', buf3.toString('hex'));
console.log('As base64:', buf3.toString('base64'));