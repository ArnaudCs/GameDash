<template>
  <v-app>
    <v-main>
      <NavBar></NavBar>
      <router-view></router-view>
      <Footer></Footer>
    </v-main>
  </v-app>
</template>

<script>
import Footer from './components/FooterComp.vue';
import NavBar from './components/NavComp.vue';

export default {
  name: 'App',

  components: {
    Footer,
    NavBar,
  },

  data: () => ({
    //
  }),
}
</script>
