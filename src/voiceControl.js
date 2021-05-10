import { firebase, db, auth } from "@/firebase.js";

export const getObjectCommand = function(rawCommand) {
  let commands = {};
  const array = rawCommand.toLowerCase().trim().split(" ");

      if (typeof window.user.calibration !== "undefined") {
        var calibrationData = trimObj(window.user.calibration);
        for (var i = 0; i < array.length; i++) {
          var prop = array[i];
          Object.keys(calibrationData).forEach((key) => {
            if (calibrationData[key][prop]) {
              array[i] = key.toLowerCase();
              console.log("changing::: " + prop + " to " + key );
            }
          })
    }
    rawCommand = array.join(' ');
  };
  

  if (array.some((x) => isColor(x))) {
    const [textColor, backgroundColor = ""] = array.filter((x) =>
      isColor(x)
    );
    commands["color"] = textColor;
    commands["background"] = backgroundColor;
  }
  if (rawCommand.includes("norma")) {
    commands = {
      bold: false,
      italic: false,
      underline: false,
      strike: false,
      color: "black",
      background: "",
    };
    return commands;
  }

  var conditions = ["strong", "bold"];
  if (conditions.some(el => rawCommand.includes(el))) {
    commands["bold"] = true;
  }
  if (rawCommand.includes("talic")) {
    commands["italic"] = true;
  }
  if (rawCommand.includes("nderline")) {
    commands["underline"] = true;
  }
  if (rawCommand.includes("strike")) {
    commands["strike"] = true;
  }
  return commands;
};

function trimObj(obj) {
  if (!Array.isArray(obj) && typeof obj != 'object') return obj;
  return Object.keys(obj).reduce(function(acc, key) {
    acc[key.trim()] = typeof obj[key] == 'string'? obj[key].trim() : trimObj(obj[key]);
    return acc;
  }, Array.isArray(obj)? []:{});
}

function isColor(strColor) {
  var s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
}
