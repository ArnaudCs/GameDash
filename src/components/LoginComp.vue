<template>
    <div class="main">
        <v-card class="mx-auto loginCard mt-5" elevation="8" color="secondary">
            <form @submit.prevent="handleSubmit">
                <v-img class="align-center loginCover text-white align-top" height="200" cover src="../assets/loginCover.jpg">
                    <v-card-title class="LoginTitle">Login</v-card-title>
                </v-img>

                <v-card-text class="pt-7 pb-4">
                    <v-responsive class="mx-auto inputForm">
                        <v-text-field
                        clearable
                        label="Email address"
                        placeholder="johndoe@gmail.com"
                        type="email"    
                        v-model="email"
                        ></v-text-field>
                    </v-responsive>

                    <v-responsive class="mx-auto inputForm">
                        <v-text-field
                        label="Password"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show1 ? 'text' : 'password'"
                        @click:append="show1 = !show1"
                        clearable
                        v-model="password"
                        hint="Enter your password to access this website"
                        ></v-text-field>
                    </v-responsive>

                    <div class="forgottenContainer">
                        <div class="inputForm">
                            <v-col cols="auto">
                                <v-dialog
                                    transition="dialog-top-transition" class="forgottenDialog"
                                >
                                    <template v-slot:activator="{ props }">
                                        <v-btn variant="plain" :ripple="false" size="small" v-bind="props">Forgotten Password</v-btn>
                                    </template>
                                    <template v-slot:default="{ isActive }">
                                    <v-card>
                                        <form @submit.prevent="handleSubmit">
                                        <v-toolbar
                                            color="fayatBlue"
                                            class="text-center"
                                            title="Réinitialisation du mot de passe"
                                        ></v-toolbar>
                                            <v-card-text>
                                                <p style="text-align: center;">Entrez votre adresse mail</p>
                                                <v-responsive class="mx-auto mt-5 forgottenMail">
                                                    <v-text-field
                                                    clearable
                                                    label="Email address"
                                                    placeholder="johndoe@gmail.com"
                                                    type="email"    
                                                    v-model="forgottenEmail"
                                                    :error="!isValidEmail"
                                                    :error-messages="!isValidEmail ? ['Veuillez entrer une adresse e-mail valide.'] : []"
                                                    ></v-text-field>
                                                </v-responsive>
                                            </v-card-text>
                                            <v-card-actions class="justify-end">
                                                <v-btn
                                                    variant="text"
                                                    @click="isActive.value = false"
                                                >Fermer</v-btn>
                                                <v-btn
                                                    variant="elevated"
                                                    color="fayatYellow"
                                                    :disabled="!isValidEmail"
                                                    @click="handleForgotPassword"
                                                >Réinitialiser</v-btn>
                                            </v-card-actions>
                                        </form>
                                    </v-card>
                                    </template>
                                </v-dialog>
                                </v-col>
                        </div>
                    </div>
                </v-card-text>

                <v-card-actions class="justify-center cardActions">

                    <v-btn rounded="pill" @click="login" size="large" type="submit" variant="outlined" class="text-white px-3 mb-5" color="fayatBlue">
                        Login
                    </v-btn>

                    <v-btn rounded="pill" @click="loginWithGoogle" variant="elevated" type="submit" prepend-icon="mdi-google" size="large" class="text-white px-3 mb-5" color="red" >
                        Login with Google
                    </v-btn>
                    
                    <v-btn variant="text" size="small" to="/register">
                        Create an account
                    </v-btn>
                </v-card-actions>
            </form>
        </v-card>

        <v-snackbar v-if="errorMessage" v-model="errorMessage" color="error" top right>
            {{errorMessage}}
        </v-snackbar>
    </div>
</template>
  <script>
  import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
    export default {
      data: () => ({
        visible: false,
        email: "",
        password: "",
        errorMessage: "",
        show1: false,
        rules: {
        required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
        },
      }),
      computed: {
          isValidEmail() {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              return emailRegex.test(this.forgottenEmail);
          },
      },
      methods: {
        login() {
          console.log(this.mail, this.password);
          signInWithEmailAndPassword(getAuth(), this.email, this.password)
            .then((userCredential) => {
                this.$router.push('/');
                console.log(userCredential);
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                switch (error.code){
                    case 'auth/invalid-email':
                        this.errorMessage = 'Adresse mail invalide';
                        break;
                    case 'auth/user-disabled':
                        this.errorMessage = 'Utilisateur désactivé';
                        break;
                    case 'auth/user-not-found':
                        this.errorMessage = 'Utilisateur non trouvé';
                        break;
                    case 'auth/wrong-password':
                        this.errorMessage = 'Mot de passe incorrect';
                        break;
                    default:    
                        this.errorMessage = 'Une erreur est survenue';
                        break;
                }
            });
        },
        loginWithGoogle() {
          const provider = new GoogleAuthProvider();
            signInWithPopup(getAuth(), provider)
                .then((result) => {
                    console.log(result);
                    this.$router.push('/')
                }).catch((error) => {
                    console.log(error);
                    
                });
        }
      }
    }
  </script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@600&display=swap');
@import url('https://fonts.cdnfonts.com/css/gotham-rounded');

.loginCard{
    width: 40%;
    border-radius: 2em;
}

.cardActions{
    flex-direction: column;
}

.forgottenDialog{
    width: 50%;
}

.forgottenMail{
    width: 80%;
}

.forgottenContainer{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
}

.main{
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding-bottom: 2vh;
}

.LoginTitle{
    text-align: center;
    font-size: 3vw;
}

.loginCover{
    object-fit: none !important;
}

.inputForm{
    width: 80%;
    text-align: center;
}

@media only screen and (max-width: 1000px) {
    .loginCard {
        width: 70%;
    }
}

@media only screen and (max-width: 767px) {
    .loginCard {
        width: 90%;
    }

    .LoginTitle{
        font-size: 8vw;
    }

    .inputForm{
        width: 90%;
    }

    .forgottenDialog{
        width: 100%;
    }

    .forgottenMail{
        width: 100%;
    }
}

</style>  