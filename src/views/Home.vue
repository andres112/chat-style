<template>
  <div>
    <chat></chat>
    <!-- <v-btn @click="emojisize" color="orange"> Emoji </v-btn> -->
  </div>
</template>

<script>
import Chat from "@/components/Chat";
// emoji-translator.js library
import Translator from "@/assets/emoji-translator.js";

export default {
  name: "Home",
  components: {
    Chat,
  },
  // TODO: Here below to remove when emojis will be implemented
  data() {
    return {
      emoji_traslator: null,
    };
  },
  created() {
    var emojiData = require("@/assets/emoji-data.json");
    this.emoji_traslator = new Translator(emojiData);
  },
  methods: {
    emojisize() {
      const trans = this.emoji_traslator.translate(
        "I love you... I feel sad and happy because i am happy, i am from Colombia and have 2 friends, one from india and another from switzerland"
      );
      alert(trans);
    },
  },
};
</script>
<style></style>
