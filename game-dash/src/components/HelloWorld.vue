<template>
  <div class="main">
    <div class="actionBar">
      <h2>Hello {{ userMail }}</h2>
      <v-btn v-if="state.isSignedIn" @click="handleSignout" color="ghostPurple" icon="mdi-power"></v-btn>
    </div>

    <div class="lastAddedDisplay">
      <p class="lastAddedTitle">Last Added Items</p>
      <div class="lastAddedCardContainer">
        <v-row>
          <v-col cols="4">
            <v-card class="lastAddedCard">
              <v-card-title>Add 1</v-card-title>
              <!-- Contenu de la carte de la colonne 1 -->
            </v-card>
          </v-col>

          <v-col cols="4">
            <v-card class="lastAddedCard">
              <v-card-title>Add 2</v-card-title>
              <!-- Contenu de la carte de la colonne 1 -->
            </v-card>
          </v-col>

          <v-col cols="4">
            <v-card class="lastAddedCard">
              <v-card-title>Add 3</v-card-title>
              <!-- Contenu de la carte de la colonne 1 -->
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>

    <div class="addItemDisplay">
      <p class="addItemTitle">Add an Item</p>
      <div class="addItemContainer">
        <v-row class="addItemRow">
          <v-col cols="4" class="coverColumn">
            <v-img src="../assets/mario.png" class="addItemCover"></v-img>
          </v-col>

          <v-col cols="8">
            <p class="addItemTitle">Add an Item to your collection to keep track</p>
            <v-card class="lastAddedCard mt-5">
              <v-card-title>Ajout 2</v-card-title>
              <!-- Contenu de la carte de la colonne 1 -->
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
    
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
let auth;
const state = reactive({
  isSignedIn: false,
  userMail: ''
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
        state.userEmail = user ? user.email : "";
      });
    });
  }
}
</script>

<style scoped>

.main{
  padding-top: 2em;
  padding-left: 5em;
  padding-right: 5em;
  padding-bottom: 5em;
}
.actionBar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2em;
}

.lastAddedDisplay{
  padding: 1em;
  border-radius: 1em;
  background-color: #242C36;
  margin-bottom: 2em;
}

.lastAddedTitle{
  font-family: 'Public Sans', sans-serif;
  font-size: 1.5em;
  color: #FFFFFF;
} 

.lastAddedCardContainer{
  margin-top: 1em;
}

.lastAddedCard{
  border-radius: 1em;
}

.addItemDisplay{
  padding: 1em;
  border-radius: 1em;
  background-color: #242C36;
}

.addItemTitle{
  font-family: 'Public Sans', sans-serif;
  font-size: 1.5em;
  color: #FFFFFF;
} 

.addItemContainer{
  margin-top: 1em;
}

.addItemRow{
  display: flex;
  flex-wrap: wrap;
}

.addItemCover{
  width: 50%;
}

.coverColumn{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>