// jshint esversion: 9
// jshint laxbreak: true
const Utils = (() => {
  const pipe =
    (...fns) =>
    init =>
      fns.reduce((v, f) => f(v), init);

  const clone = obj => JSON.parse(JSON.stringify(obj));

  const isEmptyObj = obj => 0 === Object.keys(obj).length;

  log = (...args) => (Settings.verbose ? console.log(...args) : undefined);

  return { pipe, clone, isEmptyObj, log };
})();

if ('undefined' !== typeof module) module.exports = Utils;
