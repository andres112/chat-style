<template>
  <v-card-text class="mb-5 text-center">
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
      <v-btn type="submit" title="login" color="light-green darken-2" outlined :disabled="$v.$invalid">
        Submit
      </v-btn>
    </form>
  </v-card-text>
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
      pass: "",
      rpass: "",
      showPass: false,
      register: false,
    };
  },
  mixins: [validationMixin],

  validations: {
    email: { required, email },
    name: { required, maxLength: maxLength(15) },
    pass: { required, minLength: minLength(8) },
    rpass: { sameAsPass: sameAs("pass") },
  },
  methods: {
    ...mapActions({
      createUserWithEmail: "user/createUserWithEmail",
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
