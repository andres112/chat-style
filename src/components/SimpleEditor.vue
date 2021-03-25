<template>
  <div class="simple-editor">
    <speech @onTranscriptionEnd="onEnd" :isListening="voice" />
    <v-container fluid d-inline-flex>
      <v-checkbox
        v-for="item in textStyle"
        :key="item.value"
        v-model="selected"
        :label="item.command"
        :value="item.value"
        class="ml-3"
      ></v-checkbox>
    </v-container>

    <div
      class="editor-node mx-5"
      ref="editorNode"
      style="border:1px solid; border-radius:16px"
    ></div>
    <h3>{{ lastCommand }}</h3>
    <p>{{ transcription }}</p>
  </div>
</template>

<script>
import Quill from "quill";
import Speech from "@/components/Speech";

export default {
  props: {
    value: {
      default: "",
      type: String,
    },
  },
  components: { Speech },

  data() {
    return {
      voice: false,
      textStyle: [
        { command: "strong", value: "bold" },
        { command: "italic", value: "italic" },
        { command: "underline", value: "underline" },
        { command: "strike", value: "strike" },
      ],
      transcription: [],
      lastCommand: "",
      selected: [],
      editorContent: null,
      editorInstance: null,
      editorOpts: {
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [
              "bold",
              "italic",
              "underline",
              "strike",
              { script: "sub" },
              { script: "super" },
            ],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
            [{ color: [] }, { background: [] }],
            ["clean"],
            ["link", "image", "video"],
            [{ direction: "rtl" }],
          ],
        },
        theme: "snow",
      },
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
    selected() {
      const aux = this;

      this.textStyle.forEach(function(x) {
        if (aux.selected.some((style) => style == x.value)) {
          aux.editorInstance.format(x.value, true);
          console.log(x);
        } else {
          aux.editorInstance.format(x.value, false);
        }
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

  methods: {
    initializeEditor() {
      // Set initial content that's going to be picked up by Quill
      this.$refs.editorNode.innerHTML = this.value;
      // Create the Quill instance
      this.editorInstance = new Quill(this.$refs.editorNode, this.editorOpts);

      // this.editorInstance.formatText(0, 6, {
      //   // unbolds 'hello' and set its color to blue
      //   bold: false,
      //   color: "rgb(0, 0, 255)",
      // });

      // Setup handler for whenever things change inside Quill
      this.editorInstance.on("text-change", this.onEditorContentChange);
      // Save any initial content to this.editorContent
      this.setEditorContent();
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
    onEnd({ lastSentence, transcription }) {
      this.lastCommand = lastSentence;
      this.transcription = transcription;
      const array = lastSentence.split(" ");
      if (lastSentence.includes("start")) {
        this.voice = true;
        return;
      }
      if (lastSentence.includes("stop")) {
        this.voice = false;
        return;
      }
      if (this.voice) {
        if (array.some((x) => this.isColor(x))) {
          const color = array.find((x) => this.isColor(x.toLowerCase()));
          this.editorInstance.format("color", color);
        }
        if (lastSentence.includes("normal")) {
          this.selected = [];
          this.editorInstance.format("color", "black");
          return;
        }
        if (lastSentence.includes("strong")) {
          this.selected.push("bold");
          return;
        }
        if (lastSentence.includes("talic")) {
          this.selected.push("italic");
          return;
        }
        if (lastSentence.includes("nderline")) {
          this.selected.push("underline");
          return;
        }
        if (lastSentence.includes("strike")) {
          this.selected.push("strike");
          return;
        }
      }
    },
    isColor(strColor) {
      var s = new Option().style;
      s.color = strColor;
      return s.color == strColor;
    },
  },
};
</script>
