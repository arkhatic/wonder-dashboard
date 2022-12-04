<template>
  <v-card>
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
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit
}
</style>
