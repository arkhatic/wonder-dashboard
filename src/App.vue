<template>
  <v-card v-if="!loggedIn">
    <!-- login page -->
    <v-card-title class="text-center">
      <h1 class="display-1">Login</h1>
    </v-card-title>

    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="passwordRules"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          required
          @click:append="showPassword = !showPassword"
        ></v-text-field>

        <v-btn
          color="success"
          class="white--text"
          :disabled="!valid"
          @click="loginHandler"
        >
          Login
        </v-btn>

      </v-form>
    </v-card-text>

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
  </v-card>

  <v-card v-else-if="loggedIn">
    <v-layout>
      <v-navigation-drawer expand-on-hover rail permanent>
        <v-list>
          <v-list-item
            prepend-icon="mdi-account-circle"
            title="Welcome."
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <RouterLink to="/"
            ><v-list-item
              prepend-icon="mdi-projector-screen"
              title="Projects"
              value="projects"
            ></v-list-item
          ></RouterLink>
          <RouterLink to="/head"
            ><v-list-item
              prepend-icon="mdi-account-hard-hat"
              title="Head members"
              value="headMembers"
            ></v-list-item
          ></RouterLink>
        </v-list>

        <v-divider></v-divider>
        <v-list density="compact">
          <a href="https://wonderacidstudio-website.vercel.app/" target="_blank">
            <v-list-item
              prepend-icon="mdi-logout"
              title="Preview"
              value="Preview"
            ></v-list-item>
          </a>
        </v-list>
      </v-navigation-drawer>

      <v-main class="h-screen bg-grey-darken-3">
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
  if (valid.value) {
    login(email.value, password.value).then((res) => {
      console.log(res);
      if (res) {
        loggedIn.value = true;
        snackbar.value = true;
      }
    }).catch((err) => {
      snackbarError.value = true;
    });
  }
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
a {
  text-decoration: none;
  color: inherit
}
</style>
