<template>
  <v-container>
    <v-row no-gutters>
      <v-col align-self="end">
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
        <span
          class="caption font-weight-medium red--text text--accent-4"
          v-if="invalid"
        >
          <v-icon color="red accent-4">
            fas fa-exclamation-circle
          </v-icon>
          Unrecognized Style
        </span>
      </v-col>
      <v-spacer></v-spacer>
      <v-col align-self="end" class="d-flex justify-end">
        <v-radio-group row v-model="evaluationType">
          <v-radio label="Continuous" value="con"></v-radio>
          <v-radio label="Selection" value="sel"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";

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
      evaluationType: null,
    };
  },
  computed: {
    ...mapState({
      currentStyle: (state) => state.text.currentStyle,
      invalid: (state) => state.text.invalid,
    }),
  },
  methods: {
    ...mapMutations({ setType: "evaluation/setType" }),
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

    // For TESTING purposes
    evaluationType() {
      this.setType(this.evaluationType);
    },
  },
};
</script>

<style></style>
