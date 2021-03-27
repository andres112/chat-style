<template>
  <div class="simple-editor">
    <v-container fluid d-inline-flex>
      <v-checkbox
        v-for="item in textStyle"
        :key="item.value"
        v-model="styleArray"
        :label="item.command"
        :value="item.value"
        class="ml-3"
        disabled
      ></v-checkbox>
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
    styleArray() {
      const aux = this;
      this.textStyle.forEach(function(x) {
        if (aux.styleArray.some((style) => style == x.value)) {
          if (aux.rangeSelected?.length > 0) {
            aux.editorInstance.formatText(
              aux.rangeSelected.index,
              aux.rangeSelected.length,
              { [x.value]: true }
            );
            return;
          }
          aux.editorInstance.format(x.value, true);
        } else {
          aux.editorInstance.format(x.value, false);
        }
      });
    },
    color() {
      if (this.rangeSelected?.length > 0) {
        this.editorInstance.formatText(
          this.rangeSelected.index,
          this.rangeSelected.length,
          {
            color: this.color.textColor,
            background: this.color.backgroundColor,
          }
        );
        return;
      }
      this.editorInstance.format("color", this.color.textColor);
      this.editorInstance.format("background", this.color.backgroundColor);
    },
  },

  mounted() {
    this.initializeEditor();
  },

  beforeDestroy() {
    // Turn off all listeners set on text-change
    this.editorInstance.off("text-change");
  },
  computed: { ...mapState(["styleArray", "color", "selectionFlag"]) },

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
        if (range.length == 0) {
          this.clearStyles();
        }
        this.rangeSelected = range;
      } else {
        this.rangeSelected = {};
      }
    },
  },
};
</script>
