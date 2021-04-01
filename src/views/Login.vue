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
        <v-card-text class="mb-5 text-center" v-if="!register">
          <form
            @submit.prevent="
              loginUser({
                email: $v.email.$model,
                password: $v.password.$model,
              })
            "
          >
            <v-text-field
              v-model="$v.email.$model"
              :error-messages="emailErrors"
              label="E-mail"
              required
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="$v.password.$model"
              :error-messages="passwordErrors"
              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'"
              label="Password"
              counter
              @click:append="showPass = !showPass"
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
            ></v-text-field>
            <v-btn
              class="mr-2"
              title="register"
              @click.prevent="register = !register"
              color="light-green darken-2"
              dark
            >
              Sign up
            </v-btn>
            <v-btn
              type="submit"
              title="login"
              color="light-green darken-2"
              outlined
            >
              Login
            </v-btn>
          </form>
        </v-card-text>

        <!-- Register form -->
        <v-card-text class="mb-5 text-center" v-else>
          <form
            @submit.prevent="
              createUserWithEmail({
                email: $v.email.$model,
                password: $v.pass.$model,
                name: $v.name.$model,
              })
            "
          >
            <v-text-field
              v-model="$v.name.$model"
              :error-messages="nameErrors"
              label="Name"
              required
              @input="$v.name.$touch()"
              @blur="$v.name.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="$v.email.$model"
              :error-messages="emailErrors"
              label="E-mail"
              required
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="$v.pass.$model"
              :error-messages="passErrors"
              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'"
              label="Password"
              hint="At least 8 characters"
              counter
              @click:append="showPass = !showPass"
              @input="$v.pass.$touch()"
              @blur="$v.pass.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="$v.rpass.$model"
              :error-messages="rpassErrors"
              :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPass ? 'text' : 'password'"
              label="Password"
              counter
              @click:append="showPass = !showPass"
              @input="$v.rpass.$touch()"
              @blur="$v.rpass.$touch()"
            ></v-text-field>
            <v-btn
              type="submit"
              title="login"
              color="light-green darken-2"
              outlined
            >
              Submit
            </v-btn>
          </form>
        </v-card-text>

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
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import {
  required,
  sameAs,
  email,
  minLength,
  maxLength,
} from "vuelidate/lib/validators";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      showPass: false,
      register: false,
      pass: "",
      rpass: "",
    };
  },
  mixins: [validationMixin],

  validations: {
    email: { required, email },
    password: { required },
    name: { required, maxLength: maxLength(15) },
    pass: { required, minLength: minLength(8) },
    rpass: { sameAsPass: sameAs("pass") },
  },
  methods: {
    ...mapActions([
      "googleAuth",
      "githubAuth",
      "loginUser",
      "createUserWithEmail",
    ]),
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required");
      return errors;
    },

    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Name must be at most 15 characters long");
      !this.$v.name.required && errors.push("Name is required");
      return errors;
    },
    passErrors() {
      const errors = [];
      if (!this.$v.pass.$dirty) return errors;
      !this.$v.pass.minLength &&
        errors.push("Password must be at least 8 characters long");
      !this.$v.pass.required && errors.push("Password is required");
      return errors;
    },
    rpassErrors() {
      const errors = [];
      if (!this.$v.rpass.$dirty) return errors;
      !this.$v.rpass.sameAsPass && errors.push("Passwords doesn't match");
      return errors;
    },
  },
};
</script>

<style></style>
