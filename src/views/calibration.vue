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
            <v-icon :color="color1">fas fa-circle</v-icon>        
          </v-col>
        <v-col class="mt-3" align="center">
          <v-icon :color="color2">fas fa-circle</v-icon>
        </v-col>
        <v-col class="mt-3" align="left">
          <v-icon :color="color3">fas fa-circle</v-icon>
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
      "ITALIC",
      "HIGHLIGHT",
      "COLOR",
      "UNDERLINE",
      "STRIKE",
      "STOP"
    ],
    keyWordCount: 0,
    oldKeyWord: "",
    newKeyword: "",
    currentIteration: 0,
    color1: "grey lighten-1",
    color2: "grey lighten-1",
    color3: "grey lighten-1",

  }),

  computed: {
    getColor() {
      if (this.recognizing) {
        return "light-green accent-4";
      }
      return "grey lighten-1";
    },
changeColor(){
    switch (this.currentIteration) {
    case 1:
      this.color1 = "light-green accent-4";
      break;
    case 2:
      this.color2 = "light-green accent-4";
      break;
    case 3:
      this.color3 = "light-green accent-4";
      break;
    default:
      this.color1 = "grey lighten-1";
      this.color2 = "grey lighten-1";
      this.color3 = "grey lighten-1";
    }             
    }
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
        this.recognition.maxAlternatives = 3;
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
          var alternatives = Array.from(event.results[current]);
          const calibrations = {};
          alternatives.forEach((result) => {
            calibrations[result.transcript.toLowerCase().trim()] = result.confidence;
          });
          const calibrationsGroup = {};
          calibrationsGroup[aux.newKeyword] = calibrations;

          if (aux.oldKeyWord === aux.newKeyword && aux.currentIteration < 4) {
            aux.currentIteration = aux.currentIteration + 1;
           db.collection("keyWords").doc(window.user.uid).set(calibrationsGroup, { merge: true });

            if (aux.currentIteration === 3) {
              aux.currentIteration = 0;
              aux.keyWordCount = aux.keyWordCount + 1;
              if (aux.keyWordCount < aux.keyWords.length) {
                aux.newKeyword = aux.keyWords[aux.keyWordCount];
              } else {
                aux.newKeyword = "";
                aux.recognizing = false;
                aux.recognition.onend();
              }
            }
        }
          else if (aux.oldKeyWord !== aux.newKeyword) {
            aux.currentIteration = 1;
            aux.oldKeyWord = aux.newKeyword;
            db.collection("keyWords").doc(window.user.uid).set(calibrationsGroup, { merge: true });
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

