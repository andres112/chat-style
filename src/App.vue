<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span color="light-green accent-4">Style Me</span>
        <v-spacer></v-spacer>
        <v-btn>
          <span class="mr-2">Sign out</span>
          <v-icon>fas fa-sign-out-alt</v-icon>
        </v-btn>
      </v-toolbar-title>
    </v-toolbar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: "App",
};
</script>
