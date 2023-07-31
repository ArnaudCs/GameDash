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
        <v-row v-if="this.lastAddedItems.length > 0" class="lastAddedColumn">
          <v-col v-for="item in lastAddedItems.slice(0, 3)" :key="item.id" cols="12" sm="6" md="4">
            <v-card class="lastAddedCard" elevation="8" color="primary">
              <v-img class="ItemsImages"
                height="200"
                :src="item.photoURL"
                cover
                ></v-img>
              <v-card-title>
                <v-icon v-if=" item.Type === 'Console'" color="red" icon="mdi-nintendo-game-boy" class="mr-1"></v-icon>
                <v-icon v-if=" item.Type === 'Accessorie'" color="grey" icon="mdi-video-input-scart" class="mr-1"></v-icon>
                <v-icon v-if=" item.Type === 'Game'" color="yellow" icon="mdi-pac-man" class="mr-1"></v-icon>
                {{ item.Name }}</v-card-title>
              <v-card-text>
                <v-divider class="mb-3"></v-divider>
                <p>Brand : {{ item.Brand }}</p>
                <p>Model : {{ item.Model }}</p>
                <p>Console : {{ item.Console }}</p>
                <p>With Box : {{ item.OriginalBox ? 'Yes' : 'No' }}</p>
                <p>Condition : {{ item.State }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <div v-else class="noLastItem">
          <p>Your last added items will be displayed here</p>
        </div>
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
              <p class="titleCardItem">Add a console, a game or an accessory</p>
              <v-row class="addButtons">
                <v-col cols="12" sm="4">
                  <v-card color="ghostPurple" class="btnCard" :to="'/additem'">
                    <v-card-title><v-icon icon="mdi-nintendo-game-boy" class="mr-1"></v-icon>Add a console</v-card-title>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-card color="info" class="btnCard" :to="'/addgame'">
                    <v-card-title><v-icon icon="mdi-pac-man" class="mr-1"></v-icon>Add a game</v-card-title>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-card color="grey" class="btnCard" :to="'/addaccessories'">
                    <v-card-title><v-icon icon="mdi-video-input-scart" class="mr-1"></v-icon>Add an accessory</v-card-title>
                  </v-card>
                </v-col>
              </v-row>
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
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

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

        // Récupérez les éléments triés par ordre décroissant de la date d'ajout (addDate)
        const queryItemSnapshot = await getDocs(
          query(
            itemCollection,
            where("UserId", "==", uid),
            // orderBy("addDate", "desc") Tri par ordre décroissant de la date d'ajout (addDate)
          )
        );

        const storage = getStorage();
        const storageRef = ref(storage);

        const fetchPhotoPromises = queryItemSnapshot.docs.map(async (doc) => {
          const itemData = doc.data();
          const photoFolderName = doc.id; // Nom du dossier photo à partir du nom du document

          try {
            const folderRef = ref(storageRef, `Items/${uid}/${photoFolderName}`);
            const folderList = await listAll(folderRef);
            const firstPhotoRef = folderList.items[0]; // Sélectionnez le premier fichier dans la liste

            if (firstPhotoRef) {
              const photoURL = await getDownloadURL(firstPhotoRef);
              itemData.photoURL = photoURL; // Ajoutez la propriété photoURL à l'objet itemData
            } else {
              itemData.photoURL = require("../assets/noImage.jpg");
            }

            return itemData;
          } catch (error) {
            console.log("Erreur lors du téléchargement de la photo :", error);
            itemData.photoURL = require("../assets/noImage.jpg");
            return itemData;
          }
        });

        try {
          const fetchedItems = await Promise.all(fetchPhotoPromises);
          this.lastAddedItems = fetchedItems;
          this.isLoading = false;
        } catch (error) {
          console.log("Erreur lors de la récupération des photos :", error);
          this.isLoading = false;
        }
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

.ItemsImages{
  border-radius: 1em;
}

.btnCard{
  border-radius: 1em;
  padding: 1em;
  flex-wrap: wrap;
  cursor: pointer;
}

.titleCardItem{
  font-family: 'Public Sans', sans-serif;
  font-size: 1.2em;
  color: #FFFFFF;
  margin-bottom: 1em;
}

.addButtons{
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.noLastItem{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1em;
  margin-top: 4vh;
}

.projectImages{
  width: 100%;
  height: 100%;
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
  padding: 1em;
  flex-wrap: wrap;
}

.lastAddedColumn{
  display: flex;
  justify-content: center;
}

.addItemDisplay{
  padding: 1.5em;
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