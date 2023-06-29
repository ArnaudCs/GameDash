<template>
    <div style="display: flex; flex-direction: column; width: 50%;">
        <input type="text" class="my-10" v-model="mail" />
        <input type="password" v-model="password" />
        <v-btn @click="register">Se créer un comtpe</v-btn>

        <v-btn @click="registerWithGoogle">Se connecter avec google</v-btn>
    </div>
  </template>
  <script>
  import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
    export default {
      data: () => ({
        visible: false,
        mail: "",
        password: ""
      }),
      methods: {
        register() {
          console.log(this.mail, this.password);
          createUserWithEmailAndPassword(getAuth(), this.mail, this.password)
            .then((userCredential) => {
              // Signed in 
              console.log('connecté avec succèus');
              console.log(userCredential);
              // ...
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
                console.log(errorCode, errorMessage);

              // ..
            });
        },
        registerWithGoogle() {
            const provider = new GoogleAuthProvider();
            signInWithPopup(getAuth(), provider)
                .then((result) => {
                    console.log(result);
                    this.$router.push('/')
                    // ...
                }).catch((error) => {
                    console.log(error);
                    
                });
        }
      }
    }
  </script>