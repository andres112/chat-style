<template>
  <v-card>
    <!-- Message box and speech button section -->
    <v-card-text>
      <v-row no-gutters class="mt-3" align="center" justify="center">
        <h2 class="text-center mt-5">
          Start speech recognition and <br />Pronounce the word three times
        </h2>
      </v-row>
      <v-row no-gutters class="mt-3 pt-15" align="center" justify="center">
        <v-btn icon :color="getColor" @click="listen()">
          <v-icon x-large>fas fa-microphone-alt</v-icon>
        </v-btn>
      </v-row>
      <v-row no-gutters class="mt-3 pt-15" align="center" justify="center">
        <h1>{{ newKeyword }}</h1>
      </v-row>
      <v-row no-gutters class="mt-3 pt-15" align="center" justify="center">
        <v-col class="mt-3" align="right">
          <v-btn icon :color="getCircleColor1">
            <v-icon>fas fa-circle</v-icon>
          </v-btn>
        </v-col>
        <v-col class="mt-3" align="center">
          <v-btn icon :color="getCircleColor2">
            <v-icon>fas fa-circle</v-icon>
          </v-btn>
        </v-col>
        <v-col class="mt-3" align="left">
          <v-btn icon :color="getCircleColor3">
            <v-icon>fas fa-circle</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { firebase, db, auth } from "@/firebase.js";

export default {
  name: "calibration",

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
    speechGrammarList: null,
    recognizing: false,
    ignore_onend: false,
    keyWords: [
      "START",
      "BOLD",
      "STRONG",
      "ITALIC",
      "REMOVE",
      "EMOJI"
    ],
    keyWordCount: 0,
    oldKeyWord: "",
    newKeyword: "",
    currentIteration: 0,
    circleGreen1: false,
    circleGreen2: false,
    circleGreen3: false,
  }),

  computed: {
    getColor() {
      if (this.recognizing) {
        return "light-green accent-4";
      }
      return "grey lighten-1";
    },
    getCircleColor1() {
      if (this.circleGreen1 === true) {
        return "light-green accent-4";
      }
      return "grey lighten-1";
    },
    getCircleColor2() {
      if (this.circleGreen2 === true) {
        return "light-green accent-4";
      }
      return "grey lighten-1";
    },
    getCircleColor3() {
      if (this.circleGreen3 === true) {
        return "light-green accent-4";
      }
      return "grey lighten-1";
    },
  },

  methods: {
    initialize() {
      if (!("webkitSpeechRecognition" in window)) {
        upgrade();
      } else {
        const aux = this;
        console.log(this);
        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 5;
        this.newKeyword = this.keyWords[this.keyWordCount];

        // Recognition start
        this.recognition.onstart = function () {
          aux.recognizing = true;
        };

        // Recognition error
        this.recognition.onerror = function (event) {
          if (
            event.error == "no-speech" ||
            event.error == "audio-capture" ||
            event.error == "not-allowed"
          ) {
            aux.ignore_onend = true;
          }
        };

        // Recognition stop
        this.recognition.onend = function () {
          if (aux.recognizing) {
            aux.recognition.start();
            return;
          }
          if (!aux.recognizing) {
            aux.recognition.stop();
            return;
          }
          if (aux.ignore_onend) {
            return;
          }
        };

        // Recognition result
        this.recognition.onresult = function (event) {
          var current = event.resultIndex;
          var transcript = event.results[current][0].transcript;
          console.log("The transcript is::::" + transcript);
          if (aux.currentIteration === 0) {
            aux.circleGreen1 = true;
          } else if (aux.currentIteration === 1) {
            aux.circleGreen2 = true;
          } else if (aux.currentIteration === 2) {
            aux.circleGreen3 = true;
          }
          var alternatives = Array.from(event.results[current]);
          const calibrations = {};
          alternatives.forEach((result) => {
            calibrations[result.transcript.toLowerCase().trim()] =
              result.confidence;
          });
          const calibrationsGroup = {};
          calibrationsGroup[aux.newKeyword] = calibrations;

          if (aux.oldKeyWord === aux.newKeyword && aux.currentIteration < 4) {
            aux.currentIteration = aux.currentIteration + 1;
            db.collection("keyWords")
              .doc(window.user.uid)
              .set(calibrationsGroup, { merge: true });

            if (aux.currentIteration === 3) {
              aux.currentIteration = 0;
              aux.keyWordCount = aux.keyWordCount + 1;
              if (aux.keyWordCount < aux.keyWords.length) {
                aux.newKeyword = aux.keyWords[aux.keyWordCount];
                aux.circleGreen1 = false;
                aux.circleGreen2 = false;
                aux.circleGreen3 = false;
              } else {
                aux.newKeyword = "";
                aux.circleGreen1 = false;
                aux.circleGreen2 = false;
                aux.circleGreen3 = false;
                aux.recognizing = false;
                aux.recognition.onend();
              }
            }
          } else if (aux.oldKeyWord !== aux.newKeyword) {
            aux.currentIteration = 1;
            aux.oldKeyWord = aux.newKeyword;
            db.collection("keyWords")
              .doc(window.user.uid)
              .set(calibrationsGroup, { merge: true });
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
        return;
      }
      this.recognition.start();
      this.ignore_onend = false;
      this.transcription = [];
      this.runtimeTranscription = "";
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

