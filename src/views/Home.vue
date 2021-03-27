<template>
  <div class="home">
    <speech @onTranscriptionEnd="onEnd" :isListening="voice" />
    <SimpleEditor v-model="content" />
    <pre>{{ content }}</pre>
    <h3>{{ lastCommand }}</h3>
    <p>{{ transcription }}</p>
  </div>
</template>

<script>
import SimpleEditor from "@/components/SimpleEditor";
import Speech from "@/components/Speech";
import { mapActions } from "vuex";

export default {
  name: "Home",
  components: {
    SimpleEditor,
    Speech,
  },

  data: () => ({
    content: "",
    voice: false,
    transcription: [],
    lastCommand: "",
  }),
  methods: {
    ...mapActions(["updateStyles", "clearStyles", "changeColor"]),
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
          const [textColor, backgroundColor = ""] = array.filter((x) =>
            this.isColor(x.toLowerCase())
          );
          this.changeColor({ textColor, backgroundColor });
        }
        if (lastSentence.includes("norma")) {
          this.clearStyles();
          this.changeColor("black");
          return;
        }
        if (lastSentence.includes("strong")) {
          this.updateStyles("bold");
        }
        if (lastSentence.includes("talic")) {
          this.updateStyles("italic");
        }
        if (lastSentence.includes("nderline")) {
          this.updateStyles("underline");
        }
        if (lastSentence.includes("strike")) {
          this.updateStyles("strike");
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
