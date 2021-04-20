export const getObjectCommand = function(rawCommand) {
  let commands = {};
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
  }
  return commands;
};

function isColor(strColor) {
  var s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
}
