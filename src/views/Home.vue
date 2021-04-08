<template>
  <v-layout>
    <v-flex>
      <v-card>
        <!-- <v-card-text>
          <h3>Welcome {{ user.name }}</h3>
        </v-card-text> -->
        <v-card-text class="text-sm-right">
          <v-row class="d-flex justify-end">
            <v-card max-width="374" elevation="2" shaped class="text-sm-left">
              <v-list>
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img v-if="user.photo" :src="user.photo"></v-img>
                    <v-icon v-else>fas fa-user</v-icon>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title class="text-caption text-right">
                      timestamp
                    </v-list-item-title>
                    <v-list-item-subtitle
                      style="white-space: pre-wrap;"
                      v-html="message"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-row>
        </v-card-text>
        <v-divider class="mx-2"></v-divider>
        <v-card-text>
          <v-form @submit.prevent="sendMessage({ msg: message })">
            <v-row no-gutters class="mt-3" align-center>
              <v-col cols="1" class="text-sm-right">
                <speech @onTranscriptionEnd="onEnd" :isListening="voice" />
              </v-col>
              <v-col cols="10">
                <SimpleEditor v-model="content" />
                <h5>{{ lastCommand }}</h5>
              </v-col>
              <v-btn
                fab
                icon
                small
                color="light-green darken-2"
                dark
                type="submit"
                cols="1"
                :disabled="!message"
              >
                <v-icon>fas fa-paper-plane</v-icon>
              </v-btn>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import SimpleEditor from "@/components/SimpleEditor";
import Speech from "@/components/Speech";
import { mapActions, mapState } from "vuex";

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
  computed: {
    ...mapState({
      user: (state) => state.user.user,
      message: (state) => state.text.message,
    }),
  },
  methods: {
    ...mapActions({
      updateStyles: "text/updateStyles",
    }),
    onEnd({ transcription }) {
      this.lastCommand = transcription;
      if (transcription.includes("start")) {
        this.voice = true;
        return;
      }
      if (transcription.includes("stop")) {
        this.voice = false;
        return;
      }
      if (this.voice) {
        // transform the raw speech in recognized commands
        const objectCommand = getObjectCommand(transcription);
        console.log(objectCommand);
        this.updateStyles(objectCommand);
      }
    },
    sendMessage(msg) {
      console.log(msg);
    },
  },
};
</script>
<styl scoped>
.v-chip .v-chip__content {
  height: auto !important;
}
</styl>
