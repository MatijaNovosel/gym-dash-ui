import i18n from "../i18n/index";

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

export function selectItemArrayFromEnum(translationPrefix, enumeration) {
  const selectItems = [];
  const enumObjectArray = Object.entries(enumeration).map(([k, v]) => ({
    name: k,
    id: v
  }));
  enumObjectArray
    .map(x => x.name)
    .forEach((name) => {
      selectItems.push({
        text: String(i18n.t(translationPrefix + "." + name)),
        val: enumObjectArray.filter(x => x.name == name)[0].id
      });
    });
  return selectItems;
}