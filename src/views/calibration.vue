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
        <h1>{{ currentKeyWord }}</h1>
      </v-row>
      <v-row no-gutters class="mt-3 pt-15" align="center" justify="center">
        <v-col class="mt-3" align="right">
          <v-icon id = calibrate1 :color="calibrate1.color">fas fa-circle</v-icon>
        </v-col>
        <v-col class="mt-3" align="center">
          <v-icon :color="calibrate2.color">fas fa-circle</v-icon>
        </v-col>
        <v-col class="mt-3" align="left">
          <v-icon :color="calibrate3.color">fas fa-circle</v-icon>
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
    keyWords: ["START", "BOLD", "ITALIC", "HIGHLIGHT", "COLOR", "UNDERLINE", "STRIKE", "STOP"],
    keyWordCount: 0,
    currentKeyWord: "",
    calibrate1: {
      color: "default",
    },
    calibrate2: {
      color: "default",
    },
    calibrate3: {
      color: "default",
    },
    colors: {
      green: "green",
      grey: "grey",
      red: "red",
    },
  }),

  computed: {
    getColor() {
      if (this.recognizing) {
        return "light-green accent-4";
      }
      return "grey lighten-1";
    },
    changecolor(){
      this.calibrate1.color = "light-green accent-4";
    }
  },

  methods: {
    initialize() {

      this.currentKeyWord = this.keyWords[this.keyWordCount];
      this.keyWordCount = this.keyWordCount ++;
      window.oldKeyWord = this.currentKeyWord;
      window.currentKeyWord = this.currentKeyWord;
      window.currentIteration = 0;
      
      if (!("webkitSpeechRecognition" in window)) {
        upgrade();
      } else {
        const aux = this;
        console.log(this);
        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 3;

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
          if (aux.ignore_onend) {
            return;
          }
        };

        // Recognition result
        this.recognition.onresult = function (event) {
          var current = event.resultIndex;
          var transcript = event.results[current][0].transcript;
          console.log("The transcript is::::" + transcript)
          var alternatives = Array.from(event.results[current]);
          const calibrations = {};
          var oldCount = window.currentKeyWordCount;
          alternatives.forEach((result) => {
            calibrations[result.transcript] = result.confidence;
            window.currentIteration = window.currentIteration + 1;
            //console.log(result.transcript);
          });
          const calibrationsGroup = {};
          calibrationsGroup[window.currentKeyWord] = calibrations;

          if(window.oldKeyWord === window.currentKeyWord){
            db.collection("keyWords").doc(window.user.uid).set(calibrationsGroup, { merge: true });
          }
          else{
            db.collection("keyWords").doc(window.user.uid).set(calibrationsGroup);
          }

          if(window.currentIteration === 3){
            window.oldKeyWord = window.currentKeyWord;
            window.currentKeyWord = "";
            router.push("/calibration");
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

