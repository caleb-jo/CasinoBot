
// L1
console.log('synchronous 1');

// L2
setTimeout(_ => console.log('timeout 2'), 0);

// L3
Promise.resolve().then(_ => console.log('promise 3'));

// L4
console.log('synchronous 4');


