<template>
  <div class="simple-editor">
    <div class="editor-node mx-2" ref="editorNode"></div>
    <v-container fluid d-inline-flex>
      <pre>{{ newStyle }}</pre>
      <pre>{{ editorContent }}</pre>
    </v-container>
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
  color: "black",
  background: "",
  script: "",
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
        theme: "snow",
      },
      rangeSelected: {},
      emoji_traslator: null,
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
    stylesObject() {
      const aux = this;
      const currentPos = this.editorInstance.getSelection();
      const currentStyle = this.editorInstance.getFormat(currentPos);
      // merge current style with new one
      this.newStyle = { ...currentStyle, ...this.stylesObject };

      let { index, length } = { ...this.rangeSelected };

      // Verify if text to modify is a range selection
      if (this.rangeSelected?.length > 0) {
        // before to apply the new style, validate if emoji command
        if (this.newStyle?.emoji) {
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
            // asing style to block of text
            aux.editorInstance.formatText(item.index, newlength, item);
            diff += item.length - newlength;
          });
          return;

          // console.log(length);
        }
        this.editorInstance.formatText(index, length, this.newStyle);
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

    message() {
      if (!this.message) {
        this.editorInstance.setText("");
      }
    },
  },

  mounted() {
    this.initializeEditor();
    var emojiData = require("@/assets/emoji-data.json");
    this.emoji_traslator = new Translator(emojiData);
  },

  beforeDestroy() {
    // Turn off all listeners set on text-change
    this.editorInstance.off("text-change");
  },
  computed: {
    ...mapState({
      stylesObject: (state) => state.text.stylesObject,
      message: (state) => state.text.message,
    }),
  },

  methods: {
    ...mapActions({ updateMessage: "text/updateMessage" }),
    initializeEditor() {
      // Set initial content that's going to be picked up by Quill
      this.$refs.editorNode.innerHTML = this.value;
      // Create the Quill instance
      this.editorInstance = new Quill(this.$refs.editorNode, this.editorOpts);

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
      console.log(this.rangeSelected);
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
</style>
