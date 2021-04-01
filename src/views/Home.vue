<template>
  <div class="home">
    <speech @onTranscriptionEnd="onEnd" :isListening="voice" />
    <SimpleEditor v-model="content" />
    <pre>{{ content }}</pre>
    <h3>{{ lastCommand }}</h3>
  </div>
</template>

<script>
import SimpleEditor from "@/components/SimpleEditor";
import Speech from "@/components/Speech";
import { mapActions } from "vuex";

import { getObjectCommand } from "@/voiceControl.js";

export default {
  name: "Home",
  components: {
    SimpleEditor,
    Speech,
  },

  data: () => ({
    content: "",
    voice: false,
    lastCommand: "",
  }),
  methods: {
    ...mapActions(["updateStyles", "clearStyles", "changeColor"]),
    onEnd({ lastSentence, transcription }) {
      this.lastCommand = lastSentence;
      const array = lastSentence.split(" "); //TODO: Remove
      if (lastSentence.includes("start")) {
        this.voice = true;
        return;
      }
      if (lastSentence.includes("stop")) {
        this.voice = false;
        return;
      }
      if (this.voice) {
        const objectCommand = getObjectCommand(lastSentence);
        console.log(objectCommand);
        this.updateStyles(objectCommand);
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
