<template>

    <loading-element v-if="isLoading"></loading-element>
  
    <div class="main">
      <div class="actionBar">
        <v-btn @click="goBack" color="ghostPurple" icon="mdi-arrow-left" class="mr-4"></v-btn>
        <h2>Add an item to your collection</h2>
      </div>
  
      <div class="lastAddedDisplay">
        <p class="lastAddedTitle">About your new item ...</p>
        <div class="lastAddedCardContainer">
          <div class="noLastItem">
            <div class="additemFormContainer">
                <div class="inputForm">
                    <v-text-field clearable label="Item Name"></v-text-field>
                </div>

                <div class="inputForm">
                    <v-text-field clearable label="Item Model"></v-text-field>
                </div>

                <div class="inputForm">
                    <v-select
                        v-model="itemBrand"
                        :items="brands"
                        label="Item brand"
                    ></v-select>
                </div>

                <div class="inputForm">
                    <v-select
                        v-model="itemBrand"
                        :items="conditions"
                        label="Item condition"
                    ></v-select>
                </div>

                <h2 class="mb-4">Show us your item</h2>

                <div class="inputForm">
                    <div class="helper"></div>
                    <div class="drop display-inline align-center" @dragover.prevent @drop="onDrop">
                        <div class="helper"></div>
                        <label v-if="!image" class="btn display-inline">
                                SELECT OR DROP AN IMAGE
                                <input type="file" name="image" @change="onChange">
                            </label>
                        <div class="hidden display-inline align-center" v-else v-bind:class="{ 'image': true }">
                            <img :src="image" alt="" class="img" />
                            <br>
                            <br>
                            <button class="btn" @click="removeFile">REMOVE</button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
<script>
    import LoadingElement from './LoadingElement.vue';
    import { onMounted, reactive } from "vue";
    import { getAuth, onAuthStateChanged } from "firebase/auth";
    import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
    
    let auth;
    const state = reactive({
        isSignedIn: false,
        userMail: ''
    });
    
    export default {
        name: 'AddItemComp',
        components: { LoadingElement },
        data() {
        return {
            state,
            email: '',
            image: '',
            userId: '',
            itemBrand: null,
            brands: [
                "Nintendo",
                "Sony",
                "Microsoft",
                "Sega",
                "Atari",
                "SNK",
                "NEC",
                "Panasonic",
                "Coleco",
                "Mattel",
                "Magnavox",
                "Commodore",
                "Philips",
                "Tiger",
                "Bandai",
                "Amstrad",
                "Sinclair",
                "Fairchild",
                "3DO",
                "Neo Geo"
            ],
            conditions: [
                "New",
                "Mint",
                "Very good condition",
                "Good condition",
                "Normal wear",
                "Slightly damaged",
                "Very damaged",
                "Need to be repaired",
                "Broken"
            ],
            isLoading: true,
        };
        },
        mounted() {
        this.fetchUserData();
        },
        methods: {
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
                } else {
                console.log('No user connected');
                }
            },
            goBack() {
                window.history.back(); // Simule un clic sur le bouton de retour du navigateur
            },
            onDrop: function(e) {
                e.stopPropagation();
                e.preventDefault();
                var files = e.dataTransfer.files;
                this.createFile(files[0]);
            },
            onChange(e) {
                var files = e.target.files;
                this.createFile(files[0]);
            },
            createFile(file) {
                if (!file.type.match('image.*')) {
                alert('Select an image');
                return;
                }
                var reader = new FileReader();
                var vm = this;

                reader.onload = function(e) {
                    vm.image = e.target.result;
                }
                reader.readAsDataURL(file);
            },
            removeFile() {
                this.image = '';
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
  .inputForm{
    width: 50%;
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
    justify-content: flex-start;
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
  
  .additemFormContainer{
    border-radius: 1em;
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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

  /* drag and drop */
    .btn {
        background-color: #8154AF;
        border: 0;
        color: #fff;
        cursor: pointer;
        display: inline-block;
        font-weight: bold;
        padding: 0.2em 0.7em;
        border-radius: 1em;
        margin: 1em;
        position: relative;
    }

    .btn:hover {
        background-color: #4c0d8b;
    }

    input[type="file"] {
        position: absolute;
        opacity: 0;
        z-index: -1;
    }

    .align-center {
        text-align: center;
    }

    .helper {
        height: 100%;
        display: inline-block;
        vertical-align: middle;
        width: 0;
    }

    .hidden {
        display: none !important;
    }

    .hidden.image {
        display: inline-block !important;
    }

    .display-inline {
        display: inline-block;
        vertical-align: middle;
    }

    .img {
        margin-top: 2em;
        border: 1px solid #f6f6f6;
        display: inline-block;
        height: auto;
        max-height: 80%;
        max-width: 80%;
        width: auto;
    }

    .drop {
        background-color: '#242C36';
        border: 3px dashed #ccc;
        border-radius: 1em;
        height: 100%;
        max-height: 400px;
        width: 100%;
    }
</style>