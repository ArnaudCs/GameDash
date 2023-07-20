<template>

    <loading-element v-if="isLoading"></loading-element>
  
    <div class="main">
      <div class="actionBar">
        <v-btn @click="goBack" color="ghostPurple" icon="mdi-arrow-left" class="mr-4"></v-btn>
        <h2>Add an item to your collection</h2>
      </div>
  
      <div class="lastAddedDisplay">
        <div class="titleContainer">
          <p class="lastAddedTitle">About your new item ...</p>
        </div>
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
                        v-model="itemCondition"
                        :items="conditions"
                        label="Item condition"
                    ></v-select>
                </div>

                <div class="inputForm">
                    <v-select
                        v-model="haveBox"
                        :items="yesNoResponses"
                        label="I have a box"
                    ></v-select>
                </div>

                <div class="inputForm">
                    <v-select
                        v-model="haveAllAccessories"
                        :items="yesNoResponses"
                        label="I have all the accessories"
                    ></v-select>
                </div>

                <div class="inputForm">
                  <v-textarea v-model="itemParticularities" label="Particularities" maxlength="250" auto-grow counter no-resize clearable></v-textarea>
                </div>

                <h2 class="mb-4">Show us your item</h2>

                <v-row class="lastAddedColumn">
                  <v-col cols="12" sm="6" md="4">
                    <div class="imageContainer">
                      <div class="drop display-inline align-center" @dragover.prevent @drop="onDrop(1, $event)">
                        <div v-if="!image" class="helper"></div>
                        <label v-if="!image" class="btn mb-10">
                          SELECT OR DROP AN IMAGE
                          <input type="file" name="image1" @change="onChange(1, $event)">
                        </label>
                        <div v-else class="imageContainerDisplay">
                          <img :src="image" class="img"/>
                          <v-btn class="btn" @click="removeFile(1)" variant="elevated" color="error" icon="mdi-delete"></v-btn>
                        </div>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <div class="imageContainer">
                      <div class="drop display-inline align-center" @dragover.prevent @drop="onDrop(2, $event)">
                        <div v-if="!image2" class="helper"></div>
                        <label v-if="!image2" class="btn mb-10">
                          SELECT OR DROP AN IMAGE
                          <input type="file" name="image2" @change="onChange(2, $event)">
                        </label>
                        <div v-else class="imageContainerDisplay">
                          <img :src="image2" class="img"/>
                          <v-btn class="btn" @click="removeFile(2)" variant="elevated" color="error" icon="mdi-delete"></v-btn>
                        </div>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <div class="imageContainer">
                      <div class="drop display-inline align-center" @dragover.prevent @drop="onDrop(3, $event)">
                        <div v-if="!image3" class="helper"></div>
                        <label v-if="!image3" class="btn mb-10">
                          SELECT OR DROP AN IMAGE
                          <input v-if="!image3" type="file" name="image3" @change="onChange(3, $event)">
                        </label>
                        <div v-else class="imageContainerDisplay">
                          <img :src="image3" class="img"/>
                          <v-btn class="btn" @click="removeFile(3)" variant="elevated" color="error" icon="mdi-delete"></v-btn>
                        </div>
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <div class="validateContainer mt-10">
                  <v-btn variant="elevated" rounded="pill" color="ghostPurple" @click="validate">Add item</v-btn>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <v-snackbar v-model="missingFields" color="error" :timeout="2000" location="bottom">
        Missings item informations, please fill all the fields.
    </v-snackbar>

    <v-snackbar v-model="successAddingItem" color="success" :timeout="2000" location="bottom">
        Adding item to your collection. Redirecting you to your collection.
    </v-snackbar>
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
            image2: '',
            image3: '',
            userId: '',
            haveBox: '',
            haveAllAccessories: '',
            itemParticularities: '',
            missingFields: false,
            successAddingItem: false,
            itemBrand: null,
            itemCondition: null,
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
            yesNoResponses: [
                "Yes",
                "No"
            ],
            isLoading: true,
        };
        },
        mounted() {
        this.fetchUserData();
        },
        methods: {
            validate(){
              if(this.image === '' || this.itemBrand === null || this.itemCondition === null || this.haveBox === '' || this.haveAllAccessories === ''){
                this.missingFields = true;
                return;
              } 
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
                } else {
                console.log('No user connected');
                }
            },
            goBack() {
                window.history.back(); // Simule un clic sur le bouton de retour du navigateur
            },
            removeFile(index) {
              if (index === 1) {
                this.image = '';
              } else if (index === 2) {
                this.image2 = '';
              } else if (index === 3) {
                this.image3 = '';
              }
            },

            onDrop(index, event) {
              event.stopPropagation();
              event.preventDefault();
              var files = event.dataTransfer.files;
              this.createFile(files[0], index);
            },

            onChange(index, event) {
              var files = event.target.files;
              this.createFile(files[0], index);
            },

            createFile(file, index) {
              if (!file.type.match('image.*')) {
                alert('Select an image');
                return;
              }

              var reader = new FileReader();
              var vm = this;

              reader.onload = function(e) {
                if (index === 1) {
                  vm.image = e.target.result;
                } else if (index === 2) {
                  vm.image2 = e.target.result;
                } else if (index === 3) {
                  vm.image3 = e.target.result;
                }
              };

              reader.readAsDataURL(file);
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

  .titleContainer{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1em;
  }
  .inputForm{
    width: 50%;
  }

  .imageContainer{
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
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
    text-align: center;
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
        display: flex;
        flex-direction: column;
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
        display: inline-block;
        border-radius: 1em;
        height: 60%;
        width: 60%;
        aspect-ratio: 1;
        object-fit: cover;
        box-shadow: 0px 0px 10px 0px rgba(17, 17, 17, 0.75);
    }

    .drop {
        background-color: #353D46;
        border-radius: 1em;
        height: 100%;
        width: 100%;
    }

    .imageContainerDisplay{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    @media screen and (max-width: 768px) {
      .inputForm{
        width: 90%;
      }
    }
</style>