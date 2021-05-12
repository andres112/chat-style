<template>
  <v-snackbar
    v-model="info"
    absolute
    top
    rounded
    color="rgba(33,33,33, 0.5)"
    :timeout="timeout"
  >
    <p class="text-center subtitle-1">{{ infoText }}</p>
  </v-snackbar>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      info: false,
      timeout: 3000,
    };
  },
  computed: {
    ...mapState({ infoText: (state) => state.settings.infoText }),
  },
  watch: {
    infoText() {
      this.info = true;
    },
  },
};
</script>

<style></style>
