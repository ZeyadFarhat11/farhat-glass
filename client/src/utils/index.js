export const cls = (...classes) => classes.join(" ").trim();

export const generateRandomNumber = () => {
  const min = 1;
  const max = 1000000000;
  const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
  return randomNumber;
};
