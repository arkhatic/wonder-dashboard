<template>
  <div v-if="!loggedIn" class="complete" >
    <div class="loginContainer">
      <h1>Bem vindo(a)!</h1>
      <p>Por favor, faça login para continuar.</p>

      <form>
        <div>
          <input type="email" id="email" v-model="email" placeholder="Email" />
        </div>
        <div>
          <input type="password" id="password" v-model="password" placeholder="Senha" />
        </div>
        <div>
          <button type="button" @click="loginHandler">Login</button>
        </div>
      </form>
    </div>

    <v-snackbar v-model="snackbar" color="success">
      Login successful!

      <template v-slot:actions>
        <v-btn color="success" variant="flat" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="snackbarError" color="error">
      Login failed! Please check your email and passoword.

      <template v-slot:actions>
        <v-btn color="error" variant="flat" @click="snackbarError = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>

  <v-card v-else-if="loggedIn">
    <v-layout>
      <v-navigation-drawer expand-on-hover rail permanent color="#000000">
        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-account-circle"
            :title="email"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <RouterLink to="/"
            ><v-list-item
              prepend-icon="mdi-projector-screen"
              title="Projetos"
              value="projects"
            ></v-list-item
          ></RouterLink>
          <RouterLink to="/head"
            ><v-list-item
              prepend-icon="mdi-account-hard-hat"
              title="Pessoas"
              value="headMembers"
            ></v-list-item
          ></RouterLink>
          <RouterLink to="/helpers"
            ><v-list-item
              prepend-icon="mdi-toolbox"
              title="Outros"
              value="helpers"
            ></v-list-item
          ></RouterLink>
        </v-list>

        <v-divider></v-divider>
        <v-list density="compact" nav>
          <a href="https://wonderacidstudio-website.vercel.app/" target="_blank">
            <v-list-item
              prepend-icon="mdi-logout"
              title="Preview"
              value="Preview"
            ></v-list-item>
          </a>
        </v-list>
      </v-navigation-drawer>

      <v-main class="h-screen bgbg">
        <router-view></router-view>
      </v-main>
    </v-layout>
  </v-card>
</template>

<script setup lang="ts">
import { login } from "./auth";
import { onMounted, ref } from "vue";

const loggedIn = ref(false);
const snackbarError = ref(false);
const snackbar = ref(false);

const email = ref("");
const password = ref("");
const valid = ref(false);
const showPassword = ref(false);

const emailRules = ref([
  (v: string) => !!v || "E-mail is required",
  (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
]);

const passwordRules = ref([
  (v: string) => !!v || "Password is required",
  (v: string) => v.length >= 8 || "Password must be at least 8 characters",
]);

const loginHandler = async () => {
  login(email.value, password.value).then((res) => {
    console.log(res);
    if (res) {
      loggedIn.value = true;
      snackbar.value = true;
    }
  }).catch((err) => {
    snackbarError.value = true;
  });

};

const snackbarText = ref("Wrong e-mail or password");

const snackbarHandler = () => {
  snackbar.value = false;
};

onMounted(() => {
  loggedIn.value = false;
});


</script>

<style scoped>
* {
  transition: all .3s;
}

a {
  text-decoration: none;
  color: inherit
}

.complete {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

form input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  background: #282828;
  border-radius: 5px;
}

form button {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  background: #282828;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
}

form button:hover, form input:hover {
  background: #303030;
}

form button:focus, form input:focus {
  outline: none;
}

.loginContainer {
  width: 70%;
  height: fit;
}

.loginContainer h1 {
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
}

.bgbg {
  background-color: #040404;
}

@font-face {
  font-family: 'Google Sans';
  src: url("./assets/Product Sans Regular.ttf");
}

body, h1, h2, h3, h4, h5, h6, p, a, li, span, div, input, button, textarea {
  font-family: 'Google Sans' !important;
}
</style>
