<template>
  <v-app>
    <v-main>
      <top-nav></top-nav>
      <sidebar-nav></sidebar-nav>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SidebarNav from './components/SidebarNav.vue';
import TopNav from './components/TopNav.vue';


export default {
  components: { TopNav, SidebarNav },
  name: "App",  
};
</script>
<style>
p {
  margin-bottom: 1px !important;
}
</style>
