<template>
  <v-container>
    <v-btn class="mr-2" :color="indicators.bold" x-small icon>
      <v-icon>
        fas fa-bold
      </v-icon>
    </v-btn>
    <v-btn class="mr-2" :color="indicators.italic" x-small icon>
      <v-icon>
        fas fa-italic
      </v-icon>
    </v-btn>
    <v-btn class="mr-2" :color="indicators.underline" x-small icon>
      <v-icon>
        fas fa-underline
      </v-icon>
    </v-btn>
    <v-btn class="mr-2" :color="indicators.strike" x-small icon>
      <v-icon>
        fas fa-strikethrough
      </v-icon>
    </v-btn>
    <v-btn class="mr-2" :color="indicators.color" x-small icon>
      <v-icon>
        fas fa-tint
      </v-icon>
    </v-btn>
    <v-btn class="mr-2" :color="indicators.background" x-small icon>
      <v-icon>
        fas fa-highlighter
      </v-icon>
    </v-btn>
    <v-btn class="mr-2" :color="indicators.super" x-small icon>
      <v-icon>
        fas fa-superscript
      </v-icon>
    </v-btn>
    <v-btn class="mr-2" :color="indicators.lower" x-small icon>
      <v-icon>
        fas fa-subscript
      </v-icon>
    </v-btn>
    <v-btn class="mr-2" :color="indicators.emoji" x-small icon>
      <v-icon>
        fas fa-smile-wink
      </v-icon>
    </v-btn>
    <span class="caption font-weight-medium red--text text--accent-4"> No valid commands detected</span>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Indicators",
  data() {
    return {
      indicators: {
        bold: null,
        italic: null,
        underline: null,
        strike: null,
        super: null,
        lower: null,
        color: null,
        background: null,
        emoji: null,
      },
    };
  },
  computed: {
    ...mapState({
      currentStyle: (state) => state.text.currentStyle,
    }),
  },
  methods: {
    getIconColor(data) {
      if (data) {
        return "light-green accent-4";
      }
      return "grey lighten-1";
    },
  },
  watch: {
    currentStyle: {
      handler() {
        this.indicators.bold = this.getIconColor(this.currentStyle.bold);
        this.indicators.italic = this.getIconColor(this.currentStyle.italic);
        this.indicators.underline = this.getIconColor(
          this.currentStyle.underline
        );
        this.indicators.strike = this.getIconColor(this.currentStyle.strike);
        this.indicators.super = this.getIconColor(this.currentStyle.super);
        this.indicators.lower = this.getIconColor(this.currentStyle.lower);
        this.indicators.color =
          this.currentStyle.color.length > 0
            ? this.currentStyle.color
            : this.getIconColor();
        this.indicators.background =
          this.currentStyle.background.length > 0
            ? this.currentStyle.background
            : this.getIconColor();
        this.indicators.emoji = this.getIconColor(this.currentStyle.emoji);
      },
      deep: true,
    },
  },
};
</script>

<style></style>
