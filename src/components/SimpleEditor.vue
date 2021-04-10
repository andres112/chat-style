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

const DEFAULT_COMMANDS = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  color: "black",
  background: "",
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
      textStyle: [
        { command: "strong", value: "bold" },
        { command: "italic", value: "italic" },
        { command: "underline", value: "underline" },
        { command: "strike", value: "strike" },
      ],
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
      const currentPos = this.editorInstance.getSelection();
      const currentStyle = this.editorInstance.getFormat(currentPos);
      // merge current style with new one
      this.newStyle = { ...currentStyle, ...this.stylesObject };

      // Verify if text to modify is a range selection
      if (this.rangeSelected?.length > 0) {
        this.editorInstance.formatText(
          this.rangeSelected.index,
          this.rangeSelected.length,
          this.newStyle
        );
        return;
      }

      // When there is not range selected
      const aux = this;
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
