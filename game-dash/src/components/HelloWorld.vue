<template>
  <div class="main">
    <div class="actionBar">
      <h2>Hello {{ nickName }}</h2>
      <v-btn v-if="state.isSignedIn" @click="handleSignout" color="ghostPurple" icon="mdi-power"></v-btn>
    </div>

    <div class="lastAddedDisplay">
      <p class="lastAddedTitle">Last Added Items</p>
      <div class="lastAddedCardContainer">
        <v-row class="lastAddedColumn">
          <v-col v-for="item in lastAddedItems.slice(0, 3)" :key="item.id" cols="12" sm="6" md="4">
            <v-card class="lastAddedCard">
              <v-card-title>{{ item.Name }}</v-card-title>
              <v-card-text>
                <p>Brand : {{ item.Brand }}</p>
                <p>Model : {{ item.Model }}</p>
                <p>Console : {{ item.Console }}</p>
                <p>With Box : {{ item.OriginalBox ? 'Yes' : 'No' }}</p>
                <p>Condition : {{ item.State }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>

    <div class="addItemDisplay">
      <p class="addItemTitle">Add an Item</p>
      <div class="addItemContainer">
        <v-row class="addItemRow">
          <v-col cols="12" sm="4" class="coverColumn">
            <v-img src="../assets/mario.png" class="addItemCover"></v-img>
          </v-col>

          <v-col cols="12" sm="8">
            <p class="addItemTitle">Add an Item to your collection to keep track</p>
            <v-card class="lastAddedCard mt-5">
              <v-card-title>Ajout 2</v-card-title>
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
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

let auth;
const state = reactive({
  isSignedIn: false,
  userMail: ''
});

export default {
  name: 'HelloWorld',

  data() {
    return {
      state,
      nickName: '',
      email: '',
      userId: '',
      lastAddedItems: [],
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
        const itemCollection = collection(db, "Items");

        const querySnapshot = await getDocs(query(userCollection, where("userId", "==", uid)));

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          this.nickName = userData.userName;
          console.log(userData);
        });

        //getting user items
        const queryItemSnapshot = await getDocs(query(itemCollection, where("UserId", "==", uid)));

        queryItemSnapshot.forEach((doc) => {
          const itemData = doc.data();
          this.lastAddedItems.push(itemData);
          console.log(this.lastAddedItems);
        });
      } else {
        console.log('No user connected');
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

.lastAddedColumn{
  display: flex;
  justify-content: center;
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
  justify-content: center;
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