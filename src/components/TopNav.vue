<template>
  <v-app-bar color="light-green darken-2" dark clipped-left app>
    <v-app-bar-nav-icon
      class="mx-1"
      icon
      x-large
      @click.stop="hideSidebar"
      v-if="user.uid"
    >
      <v-icon>fas fa-users</v-icon>
    </v-app-bar-nav-icon>
    <v-toolbar-title class="headline">Style Me</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-title class="text-h3" v-if="test_id">{{ test_id }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <div v-if="user.uid">
      <span class="subtitle-1 mr-2" v-if="$vuetify.breakpoint.smAndUp">{{
        user.name
      }}</span>
      <v-avatar size="36px" class="mr-2">
        <img alt="Avatar" :src="user.photo" />
      </v-avatar>
      <v-btn icon @click="closeSession()">
        <v-icon>fas fa-sign-out-alt</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState({
      user: (state) => state.user.user,
      test_id: (state) => state.evaluation.test_id,
    }),
  },
  methods: {
    ...mapActions({
      signOut: "user/signOut",
      toogleSidebar: "settings/toogleSidebar",
    }),
    closeSession() {
      this.signOut();
    },
    hideSidebar() {
      this.toogleSidebar();
    },
  },
};
</script>

<style></style>
