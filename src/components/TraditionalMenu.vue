<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>fas fa-bars</v-icon>
      </v-btn>
    </template>

    <v-card class="menu">
      <v-list>
        <v-list-item v-for="(item, index) in getItems" :key="index">
          <v-list-item-action>
            <v-switch
              v-model="currentStyle[item]"
              color="light-green darken-2"
            ></v-switch>
          </v-list-item-action>
          <v-list-item-title>{{ BOOLEAN_FORMAT[item] }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-swatches
          v-model="currentStyle.color"
          popover-x="right"
          shapes="circles"
          swatch-size="30"
          :swatches="color_list"
          show-border
          class="ml-2"
        ></v-swatches>
        <p class="ml-4">Text color</p>
      </v-card-actions>
      <v-card-actions>
        <v-swatches
          v-model="currentStyle.background"
          popover-x="right"
          shapes="circles"
          swatch-size="30"
          :swatches="color_list"
          show-border
          class="ml-2"
        ></v-swatches>
        <p class="ml-4">Background</p>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import VSwatches from "vue-swatches";

// Import the styles too, typically in App.vue or main.js
import "vue-swatches/dist/vue-swatches.css";

export default {
  data() {
    return {
      color: "#000000",
      color_list: [
        "#FFFFFF",
        "#C0C0C0",
        "#808080",
        "#000000",
        "#FF0000",
        "#800000",
        "#FFFF00",
        "#808000",
        "#00FF00",
        "#008000",
        "#00FFFF",
        "#008080",
        "#0000FF",
        "#000080",
        "#FF00FF",
        "#800080",
      ],
      menu: false,
      format: { bold: false, italic: false },
      BOOLEAN_FORMAT: {
        bold: "Bold",
        italic: "Italic",
        underline: "Underline",
        strike: "Strike",
      },
    };
  },
  components: { VSwatches },
  methods: {
    ...mapActions({ updateStyles: "text/updateStyles" }),
  },
  computed: {
    ...mapState({ currentStyle: (state) => state.text.currentStyle }),
    getItems() {
      return Object.keys(this.BOOLEAN_FORMAT);
    },
  },
};
</script>

<style scoped>
.menu {
  width: 250px;
}
.color-menu {
  height: 100px;
  position: fixed;
}
</style>
