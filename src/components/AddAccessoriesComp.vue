<template>

    <loading-element v-if="isLoading"></loading-element>
  
    <div class="main">
      <div class="actionBar">
        <v-btn @click="goBack" color="ghostPurple" icon="mdi-arrow-left" class="mr-4"></v-btn>
        <h2>Add an accessory to your collection</h2>
      </div>
  
      <div class="lastAddedDisplay">
        <div class="titleContainer">
          <p class="lastAddedTitle">About your new accessory ...</p>
        </div>
        <div class="lastAddedCardContainer">
          <div class="noLastItem">
            <div class="additemFormContainer">
                <div class="inputForm">
                    <v-text-field clearable label="Accessory Name" v-model="gameName"></v-text-field>
                </div>

                <div class="inputForm">
                    <v-select
                        v-model="accessorySystem"
                        :items="consoles"
                        label="Console"
                    ></v-select>
                </div>

                <div class="inputForm">
                    <v-select
                        v-model="accessoryBrand"
                        :items="brands"
                        label="Accessory brand"
                    ></v-select>
                </div>

                <div class="inputForm">
                    <v-select
                        v-model="accessoryCondition"
                        :items="conditions"
                        label="Accessory condition"
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
                  <v-textarea v-model="gameParticularities" label="Particularities" maxlength="250" auto-grow counter no-resize clearable></v-textarea>
                </div>

                <div class="inputForm">
                  <v-text-field clearable label="Accessory purchase price" type="number" v-model="purchasePrice"></v-text-field>
                </div>

                <h2 class="mb-4">Show us your accessory</h2>

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
    import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";
    import { getStorage, ref, uploadString} from "firebase/storage";
    
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
            haveBox: 'No',
            gameParticularities: '',
            missingFields: false,
            successAddingItem: false,
            accessoryBrand: '',
            accessoryCondition: '',
            gameName: '',
            accessorySystem: '',
            purchasePrice: '',
            consoles: [
              "SP",
              "PS Vita",
              "PS1",
              "PS2",
              "PS3",
              "PS4",
              "PS5",
              "Xbox",
              "Xbox 360",
              "Xbox One",
              "Xbox Series X",
              "Xbox Series S",
              "Nintendo Switch",
              "Nintendo Wii",
              "Nintendo Wii U",
              "Nintendo 64",
              "Nintendo Familiy Computer",
              "Super Nintendo Entertainment System (SNES)",
              "Nintendo Entertainment System (NES)",
              "Nintendo GameCube",
              "Nintendo DS",
              "Nintendo 3DS",
              "Nintendo Game Boy",
              "Nintendo Game Boy Color",
              "Nintendo Game Boy Advance",
              "Sega Genesis",
              "Sega Dreamcast",
              "Sega Saturn",
              "Sega Master System",
              "Atari 2600",
              "Atari 5200",
              "Atari 7800",
              "Atari Jaguar",
              "Neo Geo",
              "TurboGrafx-16",
              "TurboGrafx-CD",
              "PC Engine",
              "PC Engine CD",
              "Magnavox Odyssey",
              "Magnavox Odyssey 2",
              "ColecoVision",
              "Intellivision",
              "Commodore 64",
              "Amiga CD32",
              "3DO Interactive Multiplayer",
              "Panasonic Q",
              "Ouya",
              "Playdate",
              "Playdate Pulp",
              "Google Stadia",
              "Amazon Luna",
              "Anbernic RG350",
              "Anbernic RG351P",
              "Analogue Pocket",
              "Evercade",
              "Retroid Pocket 2",
              "RK2020",
              "Steam Deck",
              "Razer Kishi",
              "Game Boy Micro",
              "Game Boy Advance SP",
              "Game Boy Color",
              "Game Gear",
              "WonderSwan",
              "WonderSwan Color",
              "Virtual Boy",
              "TurboExpress",
              "N-Gage",
              "Zodiac",
              "Tapwave Zodiac 2",
              "Apple Pippin",
              "Amstrad GX4000",
              "Philips CD-i",
              "Nuon",
              "V.Smile",
              "V.Smile Pocket",
              "LeapFrog Leapster",
              "LeapFrog Leapster2",
              "Neo Geo Pocket",
              "Neo Geo Pocket Color",
              "Tapwave Zodiac",
              "Gizmondo",
              "Wonderswan Crystal",
              "HyperScan",
              "Microvision",
              "Playdia",
              "Supervision",
              "SuperVision 8000",
              "Epoch Game Pocket Computer",
              "Sega Nomad",
              "Sega Pico",
              "Sega CDX",
              "Bitcorp Gamate",
              "View-Master Interactive Vision",
              "VTech V.Smile Motion",
              "VTech Socrates",
              "Atari Lynx",
              "Amstrad GX4000",
              "Game.com",
              "Tiger R-Zone",
              "Sega VR",
              "Sega Mega Jet",
              "Sega 32X",
              "Super 32X",
              "3DO Blaster",
              "Super A'Can",
              "TurboDuo",
              "Funtech Super A'Can",
              "PlayStation TV",
              "Nintendo Switch Lite",
              "PlayStation Classic",
              "Sega Genesis Mini",
              "SNK Neo Geo Mini",
              "TurboGrafx-16 Mini",
              "Amico",
              "Evercade VS",
              "Analogue Duo",
              "Nintendo Switch OLED Model",
              "PlayStation 5 Digital Edition",
              "PlayStation Portable Go",
              "Super Famicom Classic Mini",
              "Game & Watch: Super Mario Bros.",
              "Game & Watch: The Legend of Zelda",
              "Polymega",
              "Valve Index",
              "Oculus Rift",
              "Oculus Quest",
              "Oculus Quest 2",
              "HTC Vive",
              "HTC Vive Pro",
              "PlayStation VR",
              "Windows Mixed Reality",
              "Nintendo Labo VR Kit",
              "Google Cardboard",
              "Xbox VR",
              "PS VR 2",
              "NES Classic Edition",
              "SNES Classic Edition",
              "PlayStation Classic",
              "Colecovision Flashback",
              "Sega Genesis Flashback",
              "Sega Genesis Mini 2",
              "Atari Flashback 8",
              "Atari Flashback X",
              "Neo Geo Mini Pro Player Pack",
              "Intellivision Amico"
            ],

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
          async validate() {

              const db = getFirestore();

              if (this.image === '' || this.accessoryBrand === null || this.accessoryCondition === null || this.haveBox === '') {
                this.missingFields = true;
                return;
              } 

              //const db = getFirestore(); // Décommentez cette ligne pour initialiser l'instance de la base de données
              const UserId = this.userId;
              const Brand = this.accessoryBrand;
              const Console = this.accessorySystem;
              const Name = this.gameName;
              const OriginalBox = this.haveBox === 'Yes' ? true : false;
              const State = this.accessoryCondition;
              const Particularities = this.gameParticularities;
              const PurchasePrice = this.purchasePrice;
              const Type = "Game";
              const AddDate = new Date();

                const userRef = collection(db, "Accessories");
                addDoc(userRef, { UserId, Brand, Console, Name, OriginalBox, State, Particularities, PurchasePrice, Type, AddDate })
                    .then(async (userRef) => {
                      this.successAddingItem = true;

                      const storage = getStorage();
                      const storageRef = ref(storage, `Accessories/${this.userId}/${userRef.id}`);

                      if (this.image !== '') {
                        const imageRef = ref(storageRef, 'image1'); 
                        await uploadString(imageRef, this.image, 'data_url');
                      }

                      if (this.image2 !== '') {
                        const imageRef = ref(storageRef, 'image2'); 
                        await uploadString(imageRef, this.image2, 'data_url');
                      }

                      if (this.image3 !== '') {
                        const imageRef = ref(storageRef, 'image3'); 
                        await uploadString(imageRef, this.image3, 'data_url');
                      }

                      this.isLoading = true;

                      setTimeout(() => {
                        this.$router.push('/');
                      }, 2000);
                    })
                    .catch((error) => {
                        console.log(error);
                        this.errorAddingItem = true;
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
                    this.userId = userData.userId;
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