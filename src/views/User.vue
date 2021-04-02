<template>
  <v-layout justify-center mt-5>
    <v-flex xs12 sm8 md6 xl4>
      <v-card>
        <v-card-subtitle
          class="text-h5 text-md-h4 text-xl-h3 grey--text text--darken-2"
        >
          <span v-if="!register">Login</span>
          <span v-else>Sign up</span>
        </v-card-subtitle>
        <v-divider class="mx-5"></v-divider>

        <!-- Login form -->
        <sign-in v-if="!register" @onRegisterChange="onChange"></sign-in>

        <!-- Register form -->
        <sign-up v-else @onRegisterChange="onChange"></sign-up>

        <!-- Oauth buttons -->
        <oauth></oauth>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import SignIn from "@/components/user/SignIn";
import SignUp from "@/components/user/SignUp";
import Oauth from "@/components/user/Oauth";

export default {
  name:"User",
  data() {
    return {
      showPass: false,
      register: false,
    };
  },
  components: {
    SignIn,
    SignUp,
    Oauth,
  },

  methods: {
    onChange({ register }) {
      this.register = register;
    },
  },
};
</script>

<style></style>
