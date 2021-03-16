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

export async function dataUrlToFile(dataUrl, fileName, mimeType) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: mimeType });
}

/**
 * Preuzima datoteku navedenu u parametru funkcije na računalo korisnika.
 * @param {File} file - Ulazni file.
 */
export async function download(file) {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(file, file.name);
  } else {
    const fileURL = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", file.name);
    link.click();
  }
}