<template>
  <v-layout>
    <v-card class="p-4 w-100 h-screen overflow-auto" style="padding: 30px">
      <v-list class="p-4" select-strategy="single-independent">
        <v-btn color="primary" class="white--text" @click="addNewMember()">
          <v-icon class="mr-3">mdi-plus</v-icon>
          Add new member
        </v-btn>

        <v-list-item
          v-for="(member, i) in members"
          class="mt-5 py-4 rounded bg-secondary"
          :key="i"
          :value="i"
        >
          <v-list-item-subtitle class="mb-2"
            >Member {{ i + 1 }}, id {{ member.id }}</v-list-item-subtitle
          >

          <v-text-field
            label="Member name"
            type="text"
            v-model="member.name"
          ></v-text-field>

          <v-text-field
            label="Member avatar"
            type="text"
            v-model="member.profilePicture"
          ></v-text-field>

          <v-text-field
            label="Member role"
            type="text"
            v-model="member.role"
          ></v-text-field>

          <v-btn
            color="error"
            class="white--text h-full"
            @click="removeMember(i)"
          >
            <v-icon class="mr-3">mdi-delete</v-icon>
            Remove member
          </v-btn>

          <v-btn color="success" class="white--text ml-4" @click="saveOldMember(i)">
            <v-icon class="mr-3">mdi-content-save</v-icon>
            Save
          </v-btn>
        </v-list-item>
      </v-list>
    </v-card>
  </v-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  deleteMember,
  saveMember,
  addMember,
  getHead,
  HeadMember,
  getMemberId,
} from "@/database";

const members = ref<HeadMember[]>([]);

function addNewMember() {
  const memberRef = addMember({
    name: "New member",
    profilePicture:
      "https://i.pinimg.com/originals/10/91/94/1091948c6b80b65b9eef8c163f0ae42a.jpg",
    role: "Member",
  });
  memberRef.then((member) => {
    members.value.push({ name: "", profilePicture: "", role: "", id: member });
  });
}

function removeMember(index: number) {
  deleteMember(members.value[index].id);
  members.value.splice(index, 1);
}

function saveOldMember(index: number) {
  saveMember(members.value[index]);
}

getHead().then((data) => {
  for (let i in data) {
    members.value.push({
      name: data[i].name,
      profilePicture: data[i].profilePicture,
      role: data[i].role,
      id: "",
    });
    getMemberId(data[i].name).then((id) => {
      members.value[i].id = id;
    });
  }
});
</script>