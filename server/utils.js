function fibonacci(n) {
  if (n <= 2) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function sumFibonacci(end) {
  let sum = 0;
  for (let i = 0; i <= end; i++) {
    let fib = fibonacci(i);
    sum+=fib
  }
  return sum;
}

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
  let result = ' ';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

module.exports = {
  sumFibonacci,
  generateString
};
