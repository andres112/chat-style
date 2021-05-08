<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>fas fa-bars</v-icon>
      </v-btn>
    </template>

    <v-card>
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

        <v-list-item>
          <v-list-item-action>
            <v-switch
              v-model="currentStyle.super"
              color="light-green darken-2"
            ></v-switch>
          </v-list-item-action>
          <v-list-item-title>Superscript</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-switch
              v-model="currentStyle.lower"
              color="light-green darken-2"
            ></v-switch>
          </v-list-item-action>
          <v-list-item-title>Subscript</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-action>
            <v-swatches v-model="currentStyle.color" popover-x="left" swatches="text-advanced" shapes="circles"></v-swatches>
          </v-list-item-action>
          <v-list-item-title>Text color</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-swatches v-model="currentStyle.background" popover-x="left" swatches="text-advanced" shapes="circles"></v-swatches>
          </v-list-item-action>
          <v-list-item-title>Background</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState, mapActions } from "vuex";
import VSwatches from "vue-swatches";

// Import the styles too, typically in App.vue or main.js
import "vue-swatches/dist/vue-swatches.css";

export default {
  data() {
    return {
      color: "#000000",
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

<style></style>
