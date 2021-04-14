<template>
  <v-navigation-drawer
    color="light-green lighten-5"
    :value="sidebarOn"
    clipped
    stateless
    :app="!$vuetify.breakpoint.smAndDown"
    :absolute="$vuetify.breakpoint.smAndDown"
  >
    <v-list nav shaped>
      <v-subheader>Contacts</v-subheader>
      <v-list-item-group v-model="itemSelected" active-class="green--text">
        <v-list-item v-for="user in userList" :key="user.uid" link>
          <v-list-item-avatar>
            <img :src="user.photo" />
          </v-list-item-avatar>
          <v-list-item-title>{{ user.name }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      itemSelected: null,
    };
  },
  created() {
    this.getAllUsers();
  },
  computed: {
    ...mapState({
      sidebarOn: (state) => state.settings.sidebarOn,
      userList: (state) => state.user.users,
    }),
  },
  methods: {
    ...mapActions({
      getAllUsers: "user/getAllUsers",
      setDestination: "chat/setDestination",
      snapshotMessages: "chat/snapshotMessages",
      toogleSidebar: "settings/toogleSidebar",
    }),
  },
  watch: {
    itemSelected(newValue, oldValue) {
      const userSelected = this.userList[newValue ?? oldValue];
      this.setDestination(userSelected);
      this.snapshotMessages();
      this.toogleSidebar();
    },
  },
};
</script>

<style></style>
