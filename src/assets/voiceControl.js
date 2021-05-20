import store from "@/store/index.js";

export const getObjectCommand = function(rawCommand) {
  let commands = {};

  let mapCommand = new Map();

  // Initialize the no valid indicator
  store.commit("text/setInvalid", false);
  let validCommand = false;

  const array = rawCommand
    .toLowerCase()
    .trim()
    .split(" ");

  if (typeof window.user.calibration !== "undefined") {
    var calibrationData = trimObj(window.user.calibration);
    for (var i = 0; i < array.length; i++) {
      var prop = array[i];
      Object.keys(calibrationData).forEach((key) => {
        if (calibrationData[key][prop]) {
          array[i] = key.toLowerCase();
          console.log("changing::: " + prop + " to " + key);
        }
      });
    }
    rawCommand = array.join(" ");
  }

  if (array.some((x) => isColor(x))) {
    const [textColor, backgroundColor = ""] = array.filter((x) => isColor(x));
    mapCommand.set(
      "color",
      array.findIndex((x) => isColor(x))
    );
    commands["color"] = textColor;
    commands["background"] = backgroundColor;
    validCommand = true;
  }
  if (rawCommand.includes("norma")) {
    commands = {
      bold: false,
      italic: false,
      underline: false,
      strike: false,
      color: "",
      background: "",
      emoji: false,
      script: "",
    };
    validCommand = true;
    return commands;
  }

  var conditions = ["strong", "bold"];
  if (conditions.some((el) => rawCommand.includes(el))) {
    mapCommand.set("bold", array.findIndex(x=> x.includes("strong")));
    commands["bold"] = true;
    validCommand = true;
  }
  if (rawCommand.includes("talic")) {
    mapCommand.set("italic", array.findIndex(x=> x.includes("talic")));
    commands["italic"] = true;
    validCommand = true;
  }
  if (rawCommand.includes("nderline")) {
    mapCommand.set("underline", array.findIndex(x=> x.includes("nderline")));
    commands["underline"] = true;
    validCommand = true;
  }
  if (rawCommand.includes("strike")) {
    mapCommand.set("strike", array.findIndex(x=> x.includes("strike")));
    commands["strike"] = true;
    validCommand = true;
  }
  if (rawCommand.includes("moji")) {
    mapCommand.set("emoji", array.findIndex(x=> x.includes("moji")));
    commands["emoji"] = true;
    validCommand = true;
    store.dispatch("text/updateStyles", { emoji: true });
  }
  if (rawCommand.includes("super")) {
    mapCommand.set("super", array.findIndex(x=> x.includes("super")));
    commands["script"] = "super";
    validCommand = true;
  }
  if (rawCommand.includes("lower")) {
    mapCommand.set("lower", array.findIndex(x=> x.includes("lower")));
    commands["script"] = "sub";
    validCommand = true;
  }
  // validate remove style
  const removeCond = ["remove", "remote"];
  if (removeCond.some((x) => rawCommand.includes(x))) {
    mapCommand.set(
      "remove",
      array.findIndex((x) => removeCond.includes(x))
    );
    for (const key in commands) {
      // verify if command is before of after remove keyword
      if (mapCommand.get(key) > mapCommand.get("remove")) {
        commands[key] = typeof commands[key] === "boolean" ? false : "";
      }
      // emoji command requires special treatment
      if (
        commands.hasOwnProperty("emoji") &&
        mapCommand.get("emoji") > mapCommand.get("remove")
      ) {
        store.dispatch("text/updateStyles", { emoji: false });
      }
      validCommand = true;
    }
  }

  // emoji command require special treatment
  commands["emoji"] = store.getters["text/getIsEmoji"];

  console.log(commands);
  // show invalid command indicator
  if (!validCommand) {
    store.commit("text/setInvalid", true);
    store.commit("evaluation/countErrors");
  }
  return commands;
};

function trimObj(obj) {
  if (!Array.isArray(obj) && typeof obj != "object") return obj;
  return Object.keys(obj).reduce(
    function(acc, key) {
      acc[key.trim()] =
        typeof obj[key] == "string" ? obj[key].trim() : trimObj(obj[key]);
      return acc;
    },
    Array.isArray(obj) ? [] : {}
  );
}

function isColor(strColor) {
  var s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
}
