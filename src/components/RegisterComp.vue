<template>

<div class="main"> 
        <v-card class="mx-auto RegisterCard mt-5" elevation="8" color="secondary">
            <form @submit.prevent="handleSubmit">
                <v-img class="align-center registerCover text-white align-top" height="200" cover src="../assets/registerCover.jpg">
                    <v-card-title class="RegisterTitle">Création de compte</v-card-title>
                </v-img>

                <v-card-text class="py-10">
                    <v-responsive class="mx-auto inputForm">
                        <v-text-field
                        clearable
                        prepend-icon="mdi-nintendo-game-boy"
                        label="Nickname"
                        placeholder="Pedro514"
                        type="text"    
                        required
                        v-model="Nickname"
                        ></v-text-field>
                    </v-responsive>

                    <v-responsive class="mx-auto inputForm">
                        <v-text-field
                        clearable
                        prepend-icon="mdi-at"
                        label="Mail"
                        placeholder="johndoe@gmail.com"
                        type="email"    
                        required
                        v-model="email"
                        ></v-text-field>
                    </v-responsive>

                    <v-responsive class="mx-auto inputForm">
                        <v-text-field
                            label="Password"
                            prepend-icon="mdi-lock"
                            clearable
                            :rules="[rules.min]"

                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show1 ? 'text' : 'password'"
                            @click:append="show1 = !show1"

                            required
                            hint="Enter a password"
                            v-model="password"
                        ></v-text-field>
                    </v-responsive>

                    <v-responsive class="mx-auto inputForm">
                        <v-text-field
                            label="Confirm password"
                            prepend-icon="mdi-check-all"
                            clearable
                            required
                            :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show2 ? 'text' : 'password'"
                            @click:append="show2 = !show2"

                            v-model="passwordConfirmation"
                            :error="password !== passwordConfirmation"
                            :error-messages="password !== passwordConfirmation ? ['Password mismatch !'] : []"
                        ></v-text-field>
                    </v-responsive>
                </v-card-text>
                <v-card-actions class="justify-center cardActions">
                    <v-btn rounded="pill" @click="register" variant="outlined" type="submit" size="large" class="text-white px-3 mb-5" color="#FFD700"    
                     :disabled="password !== passwordConfirmation">
                        Register
                    </v-btn>

                    <v-btn rounded="pill" @click="registerWithGoogle" variant="elevated" type="submit" prepend-icon="mdi-google" size="large" class="text-white px-3 mb-5" color="red" >
                        Register with Google
                    </v-btn>

                    <v-btn variant="text" size="small" to="/login">
                        Already have an account ? Login
                    </v-btn>
                </v-card-actions>
            </form>
        </v-card>

        <v-snackbar v-model="mailSnackBar" color="error" top right>
            Cet e-mail est déjà utilisé
        </v-snackbar>

        <v-snackbar v-model="phoneSnackBar" color="error" top right>
            Ce numéro de téléphone est déjà utilisé
        </v-snackbar>
    </div>
  </template>
  <script>
  import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import { getFirestore, collection, addDoc } from "firebase/firestore";

    export default {
      data: () => ({
        show1: false,
        show2: false,
        mailSnackBar: false,
        phoneSnackBar: false,
        Nickname: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        rules: {
            min: v => !v || v.length >= 8 || 'Min 8 characters required',
        },
      }),
        methods: {
            register() {
                const auth = getAuth();
                const db = getFirestore();

                createUserWithEmailAndPassword(auth, this.email, this.password)
                    .then((userCredential) => {
                    // Récupérer l'identifiant de l'utilisateur
                    const user = userCredential.user;
                    const userId = user.uid;
                    const userName = this.Nickname;
                    const userEmail = this.email;

                    // Ajouter le tuple dans la collection "User" avec l'identifiant de l'utilisateur
                    const userRef = collection(db, "User");
                    addDoc(userRef, { userId, userName, userEmail })
                        .then(() => {
                            this.$router.push('/'); 
                        })
                        .catch((error) => {
                            console.error("Erreur lors de l'ajout du tuple dans la collection 'User':", error);
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
            registerWithGoogle() {
                const provider = new GoogleAuthProvider();
                const auth = getAuth();
                const db = getFirestore();

                signInWithPopup(auth, provider)
                    .then((result) => {
                    // Récupérer les informations de l'utilisateur
                    const user = result.user;
                    const userId = user.uid;
                    const userName = user.displayName;
                    const userEmail = user.email;

                    // Ajouter le tuple dans la collection "User" avec les informations de l'utilisateur
                    const userRef = collection(db, "User");
                    addDoc(userRef, { userId, userName, userEmail })
                        .then(() => {
                            this.$router.push('/');
                        })
                        .catch((error) => {
                            console.error("Erreur lors de l'ajout du tuple dans la collection 'User':", error);
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
        }
    </script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@600&display=swap');
@import url('https://fonts.cdnfonts.com/css/gotham-rounded');

.RegisterCard{
    width: 40%;
    border-radius: 2em;
}

.cardActions{
    flex-direction: column;
}

.homeBtn{
    margin-top: 4vh;
}

.inputForm{
    width: 80%;
}

.main{
    display: flex;
    padding-bottom: 2vh;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.RegisterTitle{
    text-align: center;
    font-size: 2.5vw;
}

.registerCover{
    object-fit: none !important;
}

@media only screen and (max-width: 1000px) {
    .RegisterCard {
        width: 70%;
    }

    .RegisterTitle{
        font-size: 5vw;
    }
}

@media only screen and (max-width: 767px) {

    .RegisterCard {
        width: 90%;
    }

    .RegisterTitle{
        font-size: 8vw;
    }

    .inputForm{
        width: 95%;
    }
}

</style>  