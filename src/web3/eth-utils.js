// eslint-disable-next-line no-undef
const multiplier = BigInt(10 ** 18);

function toTokens(amount) {
  // eslint-disable-next-line no-undef
  const a = BigInt(amount);
  const res = a * multiplier;
  return res.toString(10);
}

function fromTokens(amount) {
  // eslint-disable-next-line no-undef
  const a = BigInt(amount);
  const res = a / multiplier;
  return res.toString(10);
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export { toTokens, fromTokens, numberWithCommas };
