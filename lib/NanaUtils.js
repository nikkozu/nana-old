var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

class Util {
  constructor(client) {
    this.client = client;
  }

  toPlural(str) {
    let arr = str.toLowerCase().split("");
    arr[0] = arr[0].toUpperCase();
    return arr.join("");
  }

  getRandInt(int) {
    return Math.floor(Math.random() * int);
  }

  parseDur(ms) {
    let seconds = ms / 1000;
    let days = parseInt(seconds / 86400);
    seconds = seconds % 86400;
    let hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    let minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds % 60);
    let fin = [];
    if (days) fin.push(`${days}d`);
    if (hours) fin.push(`${hours}h`);
    if (minutes) fin.push(`${minutes}m`);
    fin.push(`${seconds}s`);
    return fin.join(" ");
  }

  chunk(array, chunkSize) {
    const temp = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      temp.push(array.slice(i, i + chunkSize));
    }
    return temp;
  }

  sortNumber(a, b) {
    return a - b;
  }

  nFormatter(number) {
    var tier = (Math.log10(number) / 3) | 0;

    if (tier == 0) return number;

    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);
    var scaled = number / scale;

    return scaled.toFixed(2) + suffix;
  }

  convertHTML(str) {
    var conversions = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": "'",
      "&apos;": '"'
    };
    return str.replace(/&(#?[\w\d]+);?/g, find => conversions[find]);
  }
}

module.exports = Util;
