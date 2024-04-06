export function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay || 500);
  });
}

export function waitFor(condition) {
  return new Promise(async (resolve) => {
    while (!condition()) {
      await wait();
    }
    resolve();
  });
}

export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, "g"), replace);
}

export function phoneFormat(input) {
  //returns (###) ###-####
  input = input.replace(/\D/g, "").substring(0, 10); //Strip everything but 1st 10 digits
  var size = input.length;
  if (size > 0) {
    input = "(" + input;
  }
  if (size > 3) {
    input = input.slice(0, 4) + ") " + input.slice(4);
  }
  if (size > 6) {
    input = input.slice(0, 9) + "-" + input.slice(9);
  }
  return replaceAll(input.replace("(", "").replace(")", ""), "-", " ");
}

export function countChar(str, char) {
  return str.split(char).length - 1;
}
