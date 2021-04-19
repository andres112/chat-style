<template>
  <chat></chat>
</template>

<script>
import Chat from "@/components/Chat";
import Translator from "@/assets/emoji-translator.js";

export default {
  name: "Home",
  components: {
    Chat,
  },
  // TODO: Here below to remove when emojis will be implemented
  data() {
    return {
      translator: null,
    };
  },
  created() {
    var emojiData = require("@/assets/emoji-data.json");
    this.translator = new Translator(emojiData);
  },
  methods: {
    emojisize() {
      const trans = this.translator.translate(
        "I inexpressive you... I feel sad and happy because i can smile and cry, i am from Colombia"
      );
      alert(trans);
    },
  },
};
</script>
<style></style>
