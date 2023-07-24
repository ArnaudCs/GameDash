<template>

    <loading-element v-if="isLoading"></loading-element>
  
    <div class="main">
      <div class="actionBar">
        <div class="leftAction">
          <v-btn @click="goBack" color="ghostPurple" icon="mdi-arrow-left" class="mr-4"></v-btn>
          <h2>Your item collection</h2>
        </div>
        <div class="rightAction">
          <v-btn color="ghostPurple" icon="mdi-plus" :to="'/additem'"></v-btn>
        </div>
      </div>
  
      <div class="lastAddedDisplay">
        <p class="lastAddedTitle">Your items</p>
        <div class="lastAddedCardContainer">
            <div v-if="this.myItems.length > 0">
                <v-card v-for="item in myItems" :key="item.id" class="itemCard">
                    <v-row class="addItemRow" >
                        <v-col cols="12" sm="4" class="coverColumn">
                            <v-img class="ItemsImages" height="250" :src="item.photoURL" cover></v-img>
                        </v-col>

                        <v-col cols="12" sm="8">
                            <p>Brand : {{ item.Brand }}</p>
                            <p>Model : {{ item.Model }}</p>
                            <p>Console : {{ item.Console }}</p>
                            <p>With Box : {{ item.OriginalBox ? 'Yes' : 'No' }}</p>
                            <p>Condition : {{ item.State }}</p>
                        </v-col>
                    </v-row>
                </v-card>
            </div>
            <div v-else class="noLastItem">
                <p>Your items will be displayed here</p>
            </div>
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
        myItems: [],
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
      goBack() {
          window.history.back(); // Simule un clic sur le bouton de retour du navigateur
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
              const folderRef = ref(storageRef, `Items/${photoFolderName}`);
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
            this.myItems = fetchedItems;
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

  .itemCard{
    margin-bottom: 1em;
    border-radius: 1em;
    border-radius: 1em;
    padding: 1em;
  }
  
  .noLastItem{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1em;
    margin-top: 4vh;
  }
  
  .projectImages{
    object-fit: none !important;
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

  .actionBar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2em;
  }

  .leftAction{
    display: flex;
    justify-content: flex-start;
    align-items: center;
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