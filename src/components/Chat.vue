<template>
  <v-layout>
    <v-flex>
      <v-card v-if="!destination" height="85vh">
        <v-img width="25%" src="@/assets/styleme.png" class="mx-auto"></v-img>
      </v-card>
      <v-card v-else>
        <!-- Messages section -->
        <v-card-text class="chat-window" v-chat-scroll>
          <v-card-text
            class="text-xs-left"
            v-for="(msg, index) in messages"
            :key="index"
          >
            <v-row
              class="d-flex"
              :class="
                msg.source.user_uid == user.uid ? 'justify-end' : 'justify-start'
              "
            >
              <v-card
                :max-width="chatWidth"
                elevation="2"
                shaped
                class="text-xs-left mb-2"
                block
              >
                <v-list>
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-img :src="msg.source.user_photo"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title
                        class="text-caption text-right mb-2 grey--text"
                      >
                        {{ msg.date }}
                      </v-list-item-title>
                      <v-list-item-subtitle
                        style="white-space: pre-wrap;"
                        v-html="msg.message"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-row>
          </v-card-text>
        </v-card-text>

        <!-- Message box and speech button section -->
        <v-divider class="mx-2"></v-divider>
        <v-card-text>
          <v-form @submit.prevent="send({ msg: message })">
            <v-row no-gutters class="mt-3">
              <v-col cols="1" class=" text-left text-sm-right">
                <speech @onTranscriptionEnd="onEnd" :isListening="voice" />
              </v-col>
              <v-col cols="10">
                <SimpleEditor v-model="content" />
                <h5>{{ lastCommand }}</h5>
              </v-col>
              <v-col cols="1">
                <v-btn
                  large
                  icon
                  color="light-green darken-2"
                  type="submit"
                  :disabled="!message"
                >
                  <v-icon>fas fa-paper-plane</v-icon>
                </v-btn>
              </v-col>
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
import { getObjectCommand } from "@/assets/voiceControl.js";

export default {
  data: () => ({
    content: "",
    voice: false,
    lastCommand: "",
  }),
  components: {
    SimpleEditor,
    Speech,
  },
  created() {
    this.snapshotMessages();
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
      destination: (state) => state.chat.destination,
      message: (state) => state.text.message,
      messages: (state) => state.chat.messages,
    }),
    chatWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 250;
        case "sm":
          return 350;
        case "md":
          return 400;
        default:
          return 450;
      }
    },
  },
  methods: {
    ...mapActions({
      updateStyles: "text/updateStyles",
      updateMessage: "text/updateMessage",
      sendMessage: "chat/sendMessage",   
      snapshotMessages: "chat/snapshotMessages",   
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
    send(msg) {
      console.log(msg);
      this.sendMessage();
      this.updateMessage(null);
    },
  },
};
</script>

<style scoped>
.chat-window {
  overflow: auto;
  height: 75vh;
}
</style>
