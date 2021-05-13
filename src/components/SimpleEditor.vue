<template>
  <div class="simple-editor">
    <div class="editor-node mx-2" ref="editorNode"></div>
  </div>
</template>

<script>
import Quill from "quill";
import { mapState, mapActions } from "vuex";

// emoji-translator.js library as feature for editor
import Translator from "@/assets/emoji-translator.js";

const DEFAULT_COMMANDS = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  color: "",
  background: "",
  script: "",
  emoji: false,
  size: "large",
};

export default {
  props: {
    value: {
      default: "",
      type: String,
    },
  },

  data() {
    return {
      newStyle: {},
      editorContent: null,
      editorInstance: null,
      editorOpts: {
        modules: {
          toolbar: false,
        },
        theme: "bubble",
      },
      rangeSelected: {},
      emoji_traslator: null,
      emoji_menu: false,
      lastWord: null,
    };
  },

  watch: {
    value(newVal) {
      // Only update the content if it's changed from an external source
      // or else it'll act weird when you try to type anything
      if (newVal !== this.editorContent) {
        this.editorInstance.pasteHTML(newVal);
      }
    },
    currentStyle: {
      handler() {
        const aux = this;
        let currentPos = this.editorInstance.getSelection();
        if (!currentPos) {
          return;
        }
        const oldStyle = this.editorInstance.getFormat(currentPos);
        // merge current style with new one
        this.newStyle = { ...oldStyle, ...this.currentStyle };

        let { index, length } = { ...this.rangeSelected };

        // Verify if text to modify is a range selection
        if (this.rangeSelected?.length > 0) {
          // before to apply the new style, validate if emoji command
          if (this.newStyle?.emoji) {
            this.multipleWordToEmoji(index, length);
            return;
          }

          const multipleStyles = this.getMultipleStyles(index, length);
          multipleStyles.forEach((x) => {
            // include new commands to the current style
            x = { ...x, ...aux.currentCommands };
            aux.editorInstance.formatText(x.index, x.length, x);
          });

          return;
        }

        // When there is not range selected
        Object.keys(DEFAULT_COMMANDS).forEach(function(command) {
          if (aux.newStyle.hasOwnProperty(command)) {
            aux.editorInstance.format(command, aux.newStyle[command]);
            return;
          }
          aux.editorInstance.format(command, DEFAULT_COMMANDS[command]);
        });
      },
      deep: true,
    },

    // Watch every time the editor content change
    editorContent() {
      if (
        this.newStyle?.emoji &&
        (this.rangeSelected?.length == 0 || !this.rangeSelected?.length)
      ) {
        let content = this.editorInstance.getText();
        content = content.replaceAll("\n", "");
        if (content[content.length - 1] == " " && !this.lastWord) {
          return;
        }
        if (content[content.length - 1] == " " && this.lastWord) {
          const result = this.emoji_traslator.translate(this.lastWord);

          if (this.emoji_traslator.isEmoji(result)) {
            const wordIndex = content.lastIndexOf(this.lastWord);
            this.editorInstance.deleteText(wordIndex, this.lastWord.length);
            this.editorInstance.insertText(wordIndex, result);
          }
          this.lastWord = null;
          return;
        }
        let words = content.split(" ");
        this.lastWord = words[words.length - 1];
      }
    },

    // When message is sent
    message() {
      if (!this.message) {
        this.editorInstance.setText("");
      }
    },

    // When change user destination
    destination() {
      this.editorInstance.setText("");
      this.updateStyles(DEFAULT_COMMANDS);
      this.emoji_menu = false;
    },
  },

  mounted() {
    this.initializeEditor();
    var emojiData = require("@/assets/emoji-data.json");
    this.emoji_traslator = new Translator(emojiData);
    this.rangeSelected = { index: 0, length: 0 };
  },

  beforeDestroy() {
    // Turn off all listeners set on text-change
    this.editorInstance.off("text-change");
  },
  computed: {
    ...mapState({
      currentStyle: (state) => state.text.currentStyle,
      message: (state) => state.text.message,
      destination: (state) => state.chat.destination,
      currentCommands: (state) => state.text.currentCommands,
    }),
  },

  methods: {
    ...mapActions({
      updateMessage: "text/updateMessage",
      updateStyles: "text/updateStyles",
    }),
    initializeEditor() {
      // Set initial content that's going to be picked up by Quill
      this.$refs.editorNode.innerHTML = this.value;
      // Create the Quill instance
      this.editorInstance = new Quill(this.$refs.editorNode, this.editorOpts);

      this.editorInstance.format(DEFAULT_COMMANDS);

      // Setup handler for whenever things change inside Quill
      this.editorInstance.on("text-change", this.onEditorContentChange);
      // Save any initial content to this.editorContent
      this.setEditorContent();

      // Setup handler for whenever content selection change inside Quill
      this.editorInstance.on("selection-change", this.onSelectionChanged);
    },
    onEditorContentChange() {
      // Whenever we change anything, update this.editorContent
      this.setEditorContent();
      this.$emit("input", this.editorContent);
      this.rangeSelected = {}; // remove previous range seleceted when content change
    },
    setEditorContent() {
      this.editorContent = this.editorInstance.getText().trim()
        ? this.editorInstance.root.innerHTML
        : "";
      this.updateMessage(this.editorContent);
    },
    onSelectionChanged(range) {
      if (range) {
        this.rangeSelected = range;
      } else {
        this.rangeSelected = {};
      }
    },

    // Get all the formats in selected text
    getMultipleStyles(index, length) {
      let multipleStyles = [];
      let indexList = [index];
      let auxLength = 0;
      for (let i = index; i <= index + length; i++) {
        const arrayLength = multipleStyles.length;
        const style = this.editorInstance.getFormat(i, 1);
        // Executes at first iteration
        if (arrayLength == 0) {
          // initialize array with first char format
          multipleStyles.push(style);
          continue;
        }
        auxLength++;

        if (
          JSON.stringify(multipleStyles[arrayLength - 1]) !=
            JSON.stringify(style) ||
          i == index + length
        ) {
          // set the length of previous format
          multipleStyles[arrayLength - 1] = {
            ...multipleStyles[arrayLength - 1],
            ...{ length: auxLength },
          };
          if (i < index + length) {
            multipleStyles.push(style);
            indexList.push(i);
          }
          auxLength = 0;
        }
      }
      return multipleStyles.map(function(x, i) {
        x["index"] = indexList[i];
        return x;
      });
    },
    multipleWordToEmoji(index, length) {
      const aux = this;
      // get the multiple styles in selected text
      const multypleStyles = this.getMultipleStyles(index, length);
      // contains the text with emojis
      let emojiText = [];
      multypleStyles.forEach((x) => {
        const selectedText = aux.editorInstance.getText(x.index, x.length);
        emojiText.push(aux.emoji_traslator.translate(selectedText));
      });

      // control for the index variation
      let diff = 0;
      multypleStyles.forEach((item, id) => {
        item.index = item.index - diff;
        aux.editorInstance.deleteText(item.index, item.length);
        aux.editorInstance.insertText(item.index, emojiText[id]);
        // calculate the new length after emoji translation
        const newlength = emojiText[id].length;
        // Remove format set by previous insert, which is wrong
        aux.editorInstance.removeFormat(item.index, newlength);

        // include new commands to the current style
        item = { ...item, ...aux.currentCommands };

        // asing style to block of text
        aux.editorInstance.formatText(item.index, newlength, item);
        diff += item.length - newlength;
      });
    },
    selectEmoji(emoji) {
      const currentIndex = this.editorInstance.getText().length;
      this.editorInstance.insertText(currentIndex - 1, emoji.data);
    },
    hideEmojiMenu() {
      this.emoji_menu = false; // hide the emoji menu
    },
  },
};
</script>
<style scoped>
.editor-node {
  color: black;
  border-color: #616161 !important;
  border: 1px solid;
  border-radius: 20px;
  max-height: 75px;
  overflow-y: hidden;
}
.emoji-menu {
  position: absolute;
  bottom: 15%;
}
</style>
