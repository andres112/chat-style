<template>
  <v-card-text class="mb-5 text-center">
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
      <v-btn type="submit" title="login" color="light-green darken-2" outlined>
        Login
      </v-btn>
    </form>
  </v-card-text>
</template>

<script>
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      email: "",
      password: "",
      showPass: false,
      register: false,
    };
  },
  mixins: [validationMixin],

  validations: {
    email: { required, email },
    password: { required },
  },
  methods: {
    ...mapActions({
      loginUser: "user/loginUser",
    }),
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
  },
  watch: {
    register() {
      // function emited when register change
      this.$emit("onRegisterChange", {
        register: this.register,
      });
    },
  },
};
</script>

<style></style>
