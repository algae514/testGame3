export const getRandomInt = (n) => {
    // Generate a random decimal between 0 and 1
    const x = Math.random();
    // Multiply by n to get a decimal between 0 and n
    const randomDecimal = x * n;
    // Round down to the nearest integer to get a random integer between 0 and n-1
    const randomInt = Math.floor(randomDecimal);
    // Add 1 to get a random integer between 1 and n
    return randomInt + 1;
  }