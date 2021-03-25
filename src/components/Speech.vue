<template>
</template>

<script>
export default {
  name: "speech",

  props: {
    lang: {
      type: String,
      default: "en-US",
    },
    isListening: { type: Boolean, default: false },
  },

  data: () => ({
    runtimeTranscription: "",
    transcription: [],
    recognition: null,
  }),

  methods: {
    checkApi() {
      window.SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition && process.env.NODE_ENV !== "production") {
        throw new Error(
          "Speech Recognition does not exist on this browser. Use Chrome or Firefox"
        );
      }

      if (!SpeechRecognition) {
        return;
      }
      this.recognition = new SpeechRecognition();
      this.recognition.lang = this.lang;
      this.recognition.interimResults = true;
      this.recognition.addEventListener("result", (event) => {
        const text = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        this.runtimeTranscription = text;
      });

      this.recognition.addEventListener("end", () => {
        if (this.runtimeTranscription !== "") {
          this.transcription.push(this.runtimeTranscription);

          this.$emit("onTranscriptionEnd", {
            transcription: this.transcription,
            lastSentence: this.runtimeTranscription,
          });
        }

        this.runtimeTranscription = "";
        this.recognition.start();
      });
      this.recognition.start();
    },
  },

  mounted() {
    this.checkApi();
  },
};
</script>
