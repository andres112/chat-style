<template>
  <v-app>
    <v-main>
      <SimpleEditor v-model="content"/>
      <pre>{{content}}</pre>
    </v-main>
  </v-app>
</template>

<script>
import SimpleEditor from './components/SimpleEditor';

export default {
  name: 'App',

  components: {
    SimpleEditor,
  },

  data: () => ({
    content:''
  }),
};
</script>
