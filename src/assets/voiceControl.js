import store from "@/store/index.js";

export const getObjectCommand = function(rawCommand) {
  let commands = {};
  // emoji command require special treatment
  commands["emoji"] = store.getters["text/getIsEmoji"];
  const array = rawCommand
    .toLowerCase()
    .trim()
    .split(" ");
  if (array.some((x) => isColor(x))) {
    const [textColor, backgroundColor = ""] = array.filter((x) => isColor(x));
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
      emoji: false,
      script: "",
      size: "large",
    };
    return commands;
  }
  if (rawCommand.includes("strong")) {
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
  if (rawCommand.includes("moji")) {
    commands["emoji"] = true;
    store.dispatch("text/updateEmoji", true);
  }
  if (rawCommand.includes("super")) {
    commands["script"] = "super";
  }
  if (rawCommand.includes("lower")) {
    commands["script"] = "sub";
  }
  // validate remove style
  if (rawCommand.includes("remove")) {
    for (const key in commands) {
      commands[key] = typeof commands[key] === "boolean" ? false : "";
      // emoji command requires special treatment
      if (commands.hasOwnProperty("emoji")) {
        store.dispatch("text/updateEmoji", false);
      }
    }
  }

  return commands;
};

function isColor(strColor) {
  var s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
}
