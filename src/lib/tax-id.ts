const NIF_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
const CIF_LETTERS = "JABCDEFGHI";

export function normalizeTaxId(value: string): string {
  return value.toUpperCase().replace(/[\s.-]/g, "");
}

function nifLetter(number: string): string {
  return NIF_LETTERS[Number(number) % 23] ?? "";
}

function isValidNif(id: string): boolean {
  if (!/^[0-9]{8}[A-Z]$/.test(id)) return false;
  return nifLetter(id.slice(0, 8)) === id[8];
}

function isValidNie(id: string): boolean {
  if (!/^[XYZ][0-9]{7}[A-Z]$/.test(id)) return false;
  const prefix = id[0] === "X" ? "0" : id[0] === "Y" ? "1" : "2";
  return nifLetter(prefix + id.slice(1, 8)) === id[8];
}

function isValidCif(id: string): boolean {
  if (!/^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/.test(id)) return false;

  let even = 0;
  let odd = 0;
  for (let index = 0; index < 7; index += 1) {
    const digit = Number(id[index + 1]);
    if (index % 2 === 0) {
      const doubled = digit * 2;
      odd += Math.floor(doubled / 10) + (doubled % 10);
    } else {
      even += digit;
    }
  }

  const control = (10 - ((even + odd) % 10)) % 10;
  const last = id[8];
  const asDigit = String(control);
  const asLetter = CIF_LETTERS[control] ?? "";
  const letterOnly = "NPQRSW".includes(id[0]);
  const digitOnly = "ABEH".includes(id[0]);

  if (letterOnly) return last === asLetter;
  if (digitOnly) return last === asDigit;
  return last === asDigit || last === asLetter;
}

export function isValidSpanishTaxId(value: string): boolean {
  const id = normalizeTaxId(value);
  return isValidNif(id) || isValidNie(id) || isValidCif(id);
}
