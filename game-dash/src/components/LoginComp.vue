<template>
    <div style="display: flex; flex-direction: column; width: 50%;">
        <input type="text" class="my-10" v-model="mail" />
        <input type="password" v-model="password" />
        <p v-if="errorMessage">{{this.errorMessage}}</p>
        <v-btn @click="login">Se connecter</v-btn>

        <v-btn @click="loginWithGoogle">Se connecter avec google</v-btn>
    </div>
  </template>
  <script>
  import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
    export default {
      data: () => ({
        visible: false,
        mail: "",
        password: "",
        errorMessage: ""
      }),
      methods: {
        login() {
          console.log(this.mail, this.password);
          signInWithEmailAndPassword(getAuth(), this.mail, this.password)
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

              // ..
            });
        },
        loginWithGoogle() {
            console.log("register with google");
        }
      }
    }
  </script>