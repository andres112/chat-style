<template>
  <div>
    <v-btn icon :color="getColor" @click="listen()">
      <v-icon>fas fa-microphone-alt</v-icon>
    </v-btn>

    <v-btn icon :color="getCommandColor" x-small>
      <v-icon>fas fa-dot-circle</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { CreateTestID } from "@/helpers";

export default {
  name: "speech",

  props: {
    lang: {
      type: String,
      default: "en-US",
    },
  },

  data: () => ({
    runtimeTranscription: "",
    transcription: [],
    recognition: null,
    speechGrammarList: null,
    recognizing: false,
    ignore_onend: false,
  }),

  computed: {
    ...mapState({
      destination: (state) => state.chat.destination,
      commandsOn: (state) => state.chat.recognition,
      user: (state) => state.user.user,
    }),
    getColor() {
      if (this.recognizing) {
        return "light-green accent-4";
      }
      return "grey lighten-1";
    },
    getCommandColor() {
      if (this.commandsOn) {
        return "red accent-4";
      }
      return "grey lighten-1";
    },
  },

  methods: {
    ...mapActions({ setNotificationInfo: "settings/setNotificationInfo" }),
    //TODO: REMOVE AND TRANSFER TO CALIBRATION SECTION
    ...mapMutations({ setTestID: "evaluation/setTestID" }),
    initialize() {
      if (!("webkitSpeechRecognition" in window)) {
        upgrade();
      } else {
        const aux = this;
        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;

        // Recognition start
        this.recognition.onstart = function() {
          aux.recognizing = true;
        };

        // Recognition error
        this.recognition.onerror = function(event) {
          if (
            event.error == "no-speech" ||
            event.error == "audio-capture" ||
            event.error == "not-allowed"
          ) {
            aux.ignore_onend = true;
          }
        };

        // Recognition stop
        this.recognition.onend = function() {
          if (aux.recognizing) {
            aux.recognition.start();
            return;
          }
          if (aux.ignore_onend) {
            return;
          }
        };

        // Recognition result
        this.recognition.onresult = function(event) {
          aux.runtimeTranscription = "";
          aux.transcription = "";
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              aux.transcription = event.results[i][0].transcript;
              aux.$emit("onTranscriptionEnd", {
                transcription: aux.transcription,
              });
            } else {
              aux.runtimeTranscription += event.results[i][0].transcript;
            }
          }
        };
      }
    },

    upgrade() {
      console.log(
        "Web Speech API is not supported by this browser. Upgrade to Chrome version 25 or later."
      );
    },

    listen() {
      if (this.recognizing) {
        this.recognition.stop();
        this.recognizing = false;
        this.setNotificationInfo("Speech Recognition Off");
        return;
      }
      this.recognition.start();
      this.setNotificationInfo("Speech Recognition On");
      this.ignore_onend = false;
      this.transcription = [];
      this.runtimeTranscription = "";
      //TODO: REMOVE AND TRANSFER TO CALIBRATION SECTION
      // this.setTestID(CreateTestID());
      this.setTestID(this.user.name);
    },
  },

  watch: {
    destination() {
      if (this.recognizing) {
        this.listen();
      }
    },
  },

  mounted() {
    this.initialize();
  },
  beforeDestroy() {
    this.recognition.stop();
  },
};
</script>

<style scoped>
.command-indicator {
  width: 5px;
  height: 5px;
}
</style>
