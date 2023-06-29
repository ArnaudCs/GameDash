<template>
  <v-container>
    <h2>Salut tu es connecté : {{ state.isSignedIn }}</h2>
    <v-btn v-if="state.isSignedIn" @click="handleSignout">Se déconnecter</v-btn>
  </v-container>
</template>

<script>
import { onMounted, reactive } from "vue";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
let auth;
const state = reactive({
  isSignedIn: false
});

export default {
  name: 'HelloWorld',

  data() {
    return {
      state
    };
  },
  methods: {
    handleSignout() {
      signOut(auth)
        .then(() => {
          this.$router.push('/login');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  setup() {
    onMounted(() => {
      auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        state.isSignedIn = !!user;
      });
    });
  }
}
</script>
