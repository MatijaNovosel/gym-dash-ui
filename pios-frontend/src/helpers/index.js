export function initials(name) {
  let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
  let initials = [...name.matchAll(rgx)] || [];
  initials = (
    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase();
  return initials;
}

export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}