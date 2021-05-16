import store from "@/store/index.js";

export const getObjectCommand = function(rawCommand) {
  let commands = {};
  // Initialize the no valid indicator
  store.commit("text/setInvalid", false);
  let validCommand = false;

  const array = rawCommand
    .toLowerCase()
    .trim()
    .split(" ");
  if (array.some((x) => isColor(x))) {
    const [textColor, backgroundColor = ""] = array.filter((x) => isColor(x));
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
  if (rawCommand.includes("strong")) {
    commands["bold"] = true;
    validCommand = true;
  }
  if (rawCommand.includes("talic")) {
    commands["italic"] = true;
    validCommand = true;
  }
  if (rawCommand.includes("nderline")) {
    commands["underline"] = true;
    validCommand = true;
  }
  if (rawCommand.includes("strike")) {
    commands["strike"] = true;
    validCommand = true;
  }
  if (rawCommand.includes("moji")) {
    commands["emoji"] = true;
    validCommand = true;
    store.dispatch("text/updateStyles", { emoji: true });
  }
  if (rawCommand.includes("super")) {
    commands["script"] = "super";
    validCommand = true;
  }
  if (rawCommand.includes("lower")) {
    commands["script"] = "sub";
    validCommand = true;
  }
  // validate remove style
  if (["remove", "remote"].some((x) => rawCommand.includes(x))) {
    for (const key in commands) {
      commands[key] = typeof commands[key] === "boolean" ? false : "";
      // emoji command requires special treatment
      if (commands.hasOwnProperty("emoji")) {
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

function isColor(strColor) {
  var s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
}
