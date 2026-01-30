function NMIvalidation(NMI) {
  NMI = NMI.replace(/\s/g, "");

  //Check if length is 10 or 11. If 10 return True, else execute checksum
  if (NMI.length === 10) {
    return true;
  } else if (NMI.length === 11) {
    return checkSumValidation(NMI);
  }

  return false;
}

function checkSumValidation(NMI) {
  const lastDigit = NMI.charAt(NMI.length - 1);
  const NMI_reversed = NMI.slice(0, -1).split("").reverse();

  let ASCII_values = [];
  let double_ASCII = [];

  for (let index = 0; index < NMI_reversed.length; index++) {
    const element = NMI_reversed[index];
    ASCII_values.push(element.charCodeAt(0));
  }

  for (let index = 0; index < ASCII_values.length; index++) {
    const element = ASCII_values[index];
    if (index % 2 === 0) {
      double_ASCII.push(element * 2);
    } else {
      double_ASCII.push(element);
    }
  }

  const sum_digit = [];
  for (let index = 0; index < double_ASCII.length; index++) {
    let sum = 0;
    const element = double_ASCII[index].toString();
    for (let index = 0; index < element.length; index++) {
      const e = element[index];
      sum += parseInt(e);
    }
    sum_digit.push(sum);
  }

  const list_sum = sum_digit.reduce((partialSum, a) => partialSum + a, 0);

  let check_sum = Math.ceil(list_sum / 10) * 10 - list_sum;

  if (check_sum < 0) {
    check_sum = check_sum + 10;
  }

  if (check_sum === Number(lastDigit)) {
    return true;
  }
  return false;
}

export function calculateNmiChecksum(nmi) {
  const digits = (nmi || "").toString().replace(/\s/g, "");
  if (digits.length < 10) return "";

  const base = digits.slice(0, 10).split("").reverse();
  const doubled = base.map((char, index) => {
    const val = char.charCodeAt(0);
    return index % 2 === 0 ? val * 2 : val;
  });

  const sum = doubled
    .map((val) =>
      val
        .toString()
        .split("")
        .reduce((acc, digit) => acc + Number(digit), 0),
    )
    .reduce((acc, val) => acc + val, 0);

  let checksum = Math.ceil(sum / 10) * 10 - sum;
  if (checksum < 0) checksum += 10;
  return checksum.toString();
}

export function deriveNmiChecksum(nmi) {
  const digits = (nmi || "").toString().replace(/\s/g, "");
  if (!digits) return "";
  if (digits.length === 11) return digits.slice(-1);
  if (digits.length === 10) return calculateNmiChecksum(digits);
  if (digits.length > 11) return digits.slice(-1);
  return "";
}

export default NMIvalidation;
