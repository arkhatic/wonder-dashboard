<template>
  <v-snackbar v-model="snackbarAdd" :timeout="3000" color="success">
    Membro adicionado com sucesso!

    <template v-slot:actions>
      <v-btn color="success" variant="flat" @click="snackbarAdd = false">
        Fechar
      </v-btn>
    </template>
  </v-snackbar>

  <v-snackbar v-model="snackbarSave" :timeout="3000" color="success">
    Membro salvo com sucesso!

    <template v-slot:actions>
      <v-btn color="success" variant="flat" @click="snackbarSave = false">
        Fechar
      </v-btn>
    </template>
  </v-snackbar>

  <v-snackbar v-model="snackbarDelete" :timeout="3000" color="error">
    Membro deletado com sucesso!

    <template v-slot:actions>
      <v-btn color="error" variant="flat" @click="snackbarDelete = false">
        Fechar
      </v-btn>
    </template>
  </v-snackbar>

  <div class="mainContainer">
    <div class="searchWrapper">
      <v-autocomplete
        v-model="selectedMember"
        :items="members"
        color="blue-grey-lighten-2"
        item-title="name"
        item-value="name"
        variant="underlined"
        clearable
        hide-details
        label="Pesquisar"
        prepend-inner-icon="mdi-account-search"
        @update:model-value="selectMember($event)"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item
            v-bind="props"
            :prepend-avatar="item?.raw?.profilePicture"
            :title="item?.raw?.name"
            :subtitle="item?.raw?.roles[0]"
          ></v-list-item>
        </template>
      </v-autocomplete>
    </div>


    <div class="container">
      <div v-if="ready" class="profileWrapper">
        <div class="profileEditor">
          <v-text-field
            variant="filled"
            density="compact"
            label="Nome"
            type="text"
            single-line
            :placeholder="selected.name"
            :value="selected.name"
            v-model="updatedMember.name"
          ></v-text-field>

          <v-checkbox
            v-model="updatedMember.verified"
            label="Verificado"
            hide-details
            density="compact"
          ></v-checkbox>

          <v-checkbox
            v-model="updatedMember.head"
            label="Membro da head"
            density="compact"
          ></v-checkbox>

          <v-radio-group v-model="updatedMember.pronouns" inline label="Pronomes">
            <v-radio label="Ele/dele" value="Ele/dele"></v-radio>
            <v-radio label="Ela/dela" value="Ela/dela"></v-radio>
            <v-radio label="Elu/delu" value="Elu/delu"></v-radio>
          </v-radio-group>

          <v-text-field
            variant="filled"
            density="compact"
            label="Idade"
            type="number"
            single-line
            :placeholder="selected.age"
            :value="selected.age"
            v-model="updatedMember.age"
          ></v-text-field>

          <v-text-field
            variant="filled"
            density="compact"
            label="Email"
            type="email"
            single-line
            :placeholder="selected.email"
            :value="selected.email"
            v-model="updatedMember.email"
          ></v-text-field>

          <v-textarea
            variant="filled"
            density="compact"
            label="Sobre"
            auto-grow
            :placeholder="selected.about"
            :value="selected.about"
            v-model="updatedMember.about"
          ></v-textarea>

          <v-text-field
            variant="filled"
            density="compact"
            label="Link da imagem do perfil"
            type="text"
            :placeholder="selected.profilePicture"
            :value="selected.profilePicture"
            v-model="updatedMember.profilePicture"
          ></v-text-field>

          <v-divider></v-divider>
        
          <v-autocomplete
            v-model="updatedMember.roles"
            :items="roles"
            color="blue-grey-lighten-2"
            item-title="name"
            item-value="name"
            variant="underlined"
            clearable
            label="Cargos"
            multiple
            prepend-inner-icon="mdi-account-search"
          >
            <!-- <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="item.raw.name"
              ></v-list-item>
            </template> -->
          </v-autocomplete>

          <v-divider></v-divider>

          <div class="inputGroup">
            <p>Links de redes sociais/portifólios</p>
            <div
              v-for="(link, index) in updatedMember.links"
              :key="index"
              class="d-flex flex-row"
            >
              <v-text-field
                variant="filled"
                density="compact"
                label="Link"
                type="text"

                prepend-inner-icon="mdi-link"

                prepend-icon="mdi-plus"
                @click:prepend="() => {
                  if (updatedMember.links.length < 5)
                  updatedMember.links.push('')
                }"

                append-inner-icon="mdi-minus"
                @click:append-inner="() => {
                  if (updatedMember.links.length > 1)
                    updatedMember.links.splice(index, 1)
                }"

                :placeholder="selected.links[index]"
                :value="selected.links[index]"
                v-model="updatedMember.links[index]"
              ></v-text-field>
            </div>
          </div>

          <v-divider></v-divider>

          <div class="inputGroup">
            <p>Links de imagens</p>
            <div
              v-for="(image, index) in updatedMember.images"
              :key="index"
              class="d-flex flex-row"
            >
            <v-text-field
              variant="filled"
              density="compact"
              label="Link"
              type="text"

              prepend-inner-icon="mdi-link"

              prepend-icon="mdi-plus"
              @click:prepend="() => {
                if (updatedMember.images.length < 4)
                updatedMember.images.push('')
              }"

              append-inner-icon="mdi-minus"
              @click:append-inner="() => {
                if (updatedMember.images.length > 1)
                updatedMember.images.splice(index, 1)
              }"

              :placeholder="selected.images[index]"
              :value="selected.images[index]"
              v-model="updatedMember.images[index]"
            ></v-text-field>
            </div>
          </div>
        </div>

        <div class="profilePreview">
          <div class="profilePicture">
            <img :src="updatedMember.profilePicture" alt="Foto de perfil" />
          </div>

          <h2>{{ updatedMember.name }}, {{ updatedMember.age }}</h2>
          <h6>{{  updatedMember.id }}</h6>
          <p>{{ updatedMember.email }}</p>
          <v-chip>{{ updatedMember.head ? 'Membro da head' : 'Não é membro da head' }}</v-chip>
          <p>{{ updatedMember.about }}</p>

          <div class="roles">
            <v-chip style="margin: 5px;" v-for="(role, index) in updatedMember.roles" :key="index">
              {{ role }}
            </v-chip>
          </div>

          <div class="links">
            <a
              v-for="(link, index) in updatedMember.links"
              :key="index"
              :href="link"
              target="_blank"
              rel="noopener noreferrer"
              >{{ link }}</a
            >
          </div>

          <div class="images">
            <img
              v-for="(image, index) in updatedMember.images"
              :key="index"
              :src="image"
              alt="Imagem"
            />
          </div>

          <div class="buttons">
            <v-btn
              style="margin-right: 10px;"
              color="red"
              @click="() => {
                deleteSelectedMember(updatedMember.id);
                selectedMember = '';
              }"
              >Deletar</v-btn
            >
            <v-btn
              color="green"
              @click="() => {
                saveNewMember(updatedMember);
                selectedMember = '';
              }"
              >Salvar</v-btn
            >
          </div>

        </div>
      </div>

      <div v-else>
        <h1>Precisam de orientação espiritual:</h1>

        <div class="members">
          <div
            v-if="notVerified.length > 0"
            class="memberCard"
            v-for="(member, i) in notVerified"
            :key="member.name"
            @click="() => {
              selectMember(member.name)
            }"
          >
            <img :src="member.profilePicture" />

            <h3>{{ member.name }}</h3>


            <div>
              <v-chip
                style="margin: 5px 5px 0 0;"
              >
                {{ member.roles[0] }}
              </v-chip>
            </div>
          </div>

          <div v-else my-5>
            <h2>Não há ninguém para ser convertido atualmente.</h2>
          </div>
        </div>

        <v-divider style="margin: 10px 0;"></v-divider>

        <h2>Caso queira adicionar manualmente:</h2>
        <v-btn 
          color="green"
          @click="() => {
            addNewMember();
          }"
        >
          <v-icon>mdi-plus</v-icon>
          Adicionar novo membro
        </v-btn>


      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  deleteMember,
  saveMember,
  addMember,
  getMembers,
  getMember,
  getMemberId,
  getAllRoles,
} from "@/database";
import { Member, memberBoilerplate } from "../helpers/interfaces";
import { read } from "fs";

const members = ref<Member[]>([]);
const index = ref<number>(-1);
const notVerified = ref<Member[]>([]);

const selectedMember = ref<string>();
const selected = ref<Member>();
const ready = ref<boolean>(false);

const updatedMember = ref<Member>(memberBoilerplate);

const snackbarAdd = ref(false);
const snackbarDelete = ref(false);
const snackbarSave = ref(false);

const roles = ref<string[]>([]);

function selectMember(member: string) {
  if (member === null) {
    ready.value = false;
  } else {
    getMemberId(member).then((id) => {
      getMember(id).then((data) => {
        ready.value = true;
        selected.value = data;
        updatedMember.value = data;
      });
    });
  }
}

function selectMemberByIndex(i: number) {
  index.value = i;
  updatedMember.value = members.value[i];
  selected.value = members.value[i];
  selectedMember.value = members.value[i].name;
  ready.value = true;
}


function addNewMember() {
  const memberRef = addMember();
  memberRef.then((id) => {
    members.value.push({
      id: id,
      name: "",
      age: "",
      email: "",
      head: false,
      pronouns: "",
      about: "",
      roles: [],
      links: [''],
      images: [''],
      profilePicture: "",
      verified: false,
    });
    selectMemberByIndex(members.value.length - 1);
  });

  snackbarAdd.value = true;
}

function saveNewMember(member: Member) {
  // if member was in notVerified, remove it from the array
  console.log(members.value)
  if (member.verified) {
    notVerified.value = notVerified.value.filter((m) => m.id !== member.id);
  }
  else {
    if (!notVerified.value.some((m) => m.id === member.id)) {
      notVerified.value.push(member);
    }
  }
  
  // update members array
  members.value = members.value.map((m) => {
    if (m.id === member.id) {
      return member;
    } else {
      return m;
    }
  });

  saveMember({
    id: member.id,
    name: member.name,
    age: member.age,
    email: member.email,
    head: member.head,
    pronouns: member.pronouns,
    about: member.about,
    roles: member.roles,
    links: member.links,
    images: member.images,
    profilePicture: member.profilePicture,
    verified: member.verified,
  });
  
  snackbarSave.value = true;
  ready.value = false;
}

function deleteSelectedMember(id: string) {
  deleteMember(id);
  members.value = members.value.filter((m) => m.id !== id);
  snackbarDelete.value = true;
  ready.value = false;
}

onMounted(async () => {
  await getMembers().then((data) => {
    for (let i in data) {
      console.log(data[i].verified)
      members.value.push({
        id: "",
        verified: data[i].verified,
        head: data[i].head,
        email: data[i].email,

        name: data[i].name,
        pronouns: data[i].pronouns,
        age: data[i].age,
        profilePicture: data[i].profilePicture,
        about: data[i].about,

        roles: data[i].roles,
        links: data[i].links,
        images: data[i].images,
      });
      getMemberId(data[i].name).then((id) => {
        members.value[i].id = id;
      });

      if (data[i].verified === false) {
        notVerified.value.push({
          id: data[i].id,
          verified: data[i].verified,
          head: data[i].head,
          email: data[i].email,

          name: data[i].name,
          pronouns: data[i].pronouns,
          age: data[i].age,
          profilePicture: data[i].profilePicture,
          about: data[i].about,

          roles: data[i].roles,
          links: data[i].links,
          images: data[i].images,
        });
      }
    }
  });

  await getAllRoles().then((data) => {
    for (let i in data) {
      for (let j in data[i]) {
        for (let k in data[i][j]) {
          roles.value.push(data[i][j][k]);
        }
      }
    }
  });
});
</script>

<style scoped>
.mainContainer {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.container {
  height: 100vh;
  padding: 5px 15px;
  overflow-y: scroll;
}

.searchWrapper {
  width: 100%;
  padding: 15px;
}

.profileWrapper {
  margin: auto 0;

  display: flex;
  justify-content: space-evenly;
}
.profileEditor {
  background-color: #181818;
  border-radius: 5px;
  padding: 15px;

  width: 45%;
  height: fit-content;
  display: flex;
  flex-direction: column;
}

.profilePreview {
  width: fit-content;
  height: fit-content;
  background-color: #181818;
  border-radius: 5px;
}

.inputGroup {
  margin-top: 15px;
}

.inputGroup p {
  margin-bottom: 5px;
}

.profilePreview {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.profilePreview p {
  margin: 10px 0;
}

.profilePicture img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.profilePreview .roles {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.profilePreview .links {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.profilePreview .links a {
  margin: 5px;
}

.profilePreview .images {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 15px;
}

.profilePreview .images img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin: 5px;
}

.profilePreview .buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.profilePreview .buttons v-btn {
  margin: 10px;
}

.memberCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: #111111;
  margin: 10px;

  width: 200px;
  height: fit-content;

  border-radius: 10px;

  cursor: pointer;
}
.memberCard:hover {
  background-color: #181818;
}

.memberCard img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.members {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 15px;
}
</style>
