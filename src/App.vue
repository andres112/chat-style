<template>
  <v-app>
    <v-main>
      <v-toolbar color="light-green darken-2" dark>
        <v-toolbar-title class="headline">Style Me</v-toolbar-title>
        <v-spacer></v-spacer>
        <router-link to="/user">
          <v-btn icon>
            <v-icon>fas fa-sign-in-alt</v-icon>
          </v-btn>
        </router-link>
      </v-toolbar>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>
