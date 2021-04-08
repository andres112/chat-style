<template>
  <v-app>
    <v-main>
      <v-toolbar color="light-green darken-2" dark>
        <v-toolbar-title class="headline">Style Me</v-toolbar-title>
        <v-spacer></v-spacer>
        <div v-if="user.uid">
          <span class="subtitle-1 mr-2" v-if="$vuetify.breakpoint.smAndUp">{{
            user.name
          }}</span>
          <v-avatar size="36px" class="mr-2">
            <img v-if="user.photo" alt="Avatar" :src="user.photo" />
            <v-icon v-else>fas fa-user</v-icon>
          </v-avatar>
          <v-btn icon @click="closeSession()">
            <v-icon>fas fa-sign-out-alt</v-icon>
          </v-btn>
        </div>
      </v-toolbar>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapState({ user: (state) => state.user.user }),
  },
  methods: {
    ...mapActions({ signOut: "user/signOut" }),
    closeSession() {
      this.signOut();
    },
  },
};
</script>
<style>
p {
  margin-bottom: 1px !important;
}
</style>
