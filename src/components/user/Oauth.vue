<template>
  <v-card-text class="mb-5 text-center">
    <small style="display:block"> Or ingress with: </small>
    <v-btn
      color="red darken-1"
      class=" my-1 white--text"
      large
      @click="googleAuth"
    >
      <v-icon left dark>fab fa-google</v-icon>
      Google
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn
      color="grey darken-4"
      class=" my-1 white--text"
      large
      @click="githubAuth"
    >
      <v-icon left dark>fab fa-github</v-icon>
      Github
    </v-btn>
  </v-card-text>
</template>

<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions({
      googleAuth: "user/googleAuth",
      githubAuth: "user/githubAuth",
    }),
  },
};
</script>

<style></style>
