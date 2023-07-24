<template>

  <loading-element v-if="isLoading"></loading-element>

  <div class="main">
    <div class="actionBar">
      <h2>Hello {{ nickName }}</h2>
      <v-btn v-if="state.isSignedIn" @click="handleSignout" color="ghostPurple" icon="mdi-power"></v-btn>
    </div>

    <div class="lastAddedDisplay">
      <p class="lastAddedTitle">Last Added Items</p>
      <div class="lastAddedCardContainer">
        <v-row v-if="this.menus.length > 0" class="lastAddedColumn">
          <v-col v-for="item in menus" :key="item.id" cols="12" sm="6" md="4">
            <v-card class="Collection" color="ghostPurple" :to="item.route">
                {{ item.name }}
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingElement from './LoadingElement.vue';
import { onMounted, reactive } from "vue";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

let auth;
const state = reactive({
  isSignedIn: false,
  userMail: ''
});

export default {
  name: 'HelloWorld',
  components: { LoadingElement },
  data() {
    return {
      state,
      nickName: '',
      email: '',
      userId: '',
      isLoading: true,
      lastAddedItems: [],
      menus: [
        {name : "Consoles", route : "/dashboard-items"},
        {name : "Games" , route : "/dashboard-games"},
        {name : "Accessories" , route : "/dashboard-accessories"},
      ]
    };
  },
  mounted() {
    this.fetchUserData();
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
    },
    async fetchUserData() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const uid = user.uid;

        const db = getFirestore();
        const userCollection = collection(db, "User");

        const querySnapshot = await getDocs(query(userCollection, where("userId", "==", uid)));

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          this.nickName = userData.userName;
          this.isLoading = false;
        });
      }
    },
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

.Collection{
  border-radius: 1em;
  padding: 1.5em;
  margin-bottom: 2em;
  cursor: pointer;
}

.noLastItem{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1em;
  margin-top: 4vh;
}

.main{
  padding-top: 4vh;
  padding-left: 4vw;
  padding-right: 4vw;
  padding-bottom: 10vh;
}
.actionBar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2em;
}
.lastAddedDisplay{
  padding: 1.5em;
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

.lastAddedColumn{
  display: flex;
  justify-content: center;
}

</style>