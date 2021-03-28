<template>
  <div class="simple-editor">
    <v-container fluid d-inline-flex>
      <pre>{{ stylesObject }}</pre>
    </v-container>

    <div
      class="editor-node mx-5"
      ref="editorNode"
      style="border:1px solid; border-radius:16px"
    ></div>
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
      const newStyle = this.stylesObject;

      // Verify if text to modify is a range selection
      if (this.rangeSelected?.length > 0) {
        this.editorInstance.formatText(
          this.rangeSelected.index,
          this.rangeSelected.length,
          newStyle
        );
        return;
      }

      // When there is not range selected
      const aux = this;
      Object.keys(DEFAULT_COMMANDS).forEach(function(command) {
        if (newStyle.hasOwnProperty(command)) {
          aux.editorInstance.format(command, newStyle[command]);
          return;
        }
        aux.editorInstance.format(command, DEFAULT_COMMANDS[command]);
      });
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
    ...mapState(["selectionFlag", "stylesObject"]),
  },

  methods: {
    ...mapActions(["clearStyles"]),
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
    },
    setEditorContent() {
      this.editorContent = this.editorInstance.getText().trim()
        ? this.editorInstance.root.innerHTML
        : "";
    },
    onSelectionChanged(range) {
      if (range) {
        this.rangeSelected = range;
      } else {
        this.rangeSelected = {};
      }
    },
  },
};
</script>
