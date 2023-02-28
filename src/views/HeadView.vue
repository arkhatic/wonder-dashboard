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
            <v-radio label="He/His" value="He/His"></v-radio>
            <v-radio label="She/Her" value="She/Her"></v-radio>
            <v-radio label="They/Them" value="They/Them"></v-radio>
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
          
          <v-text-field
            variant="filled"
            density="compact"
            label="Discord ID"
            type="text"
            single-line
            :placeholder="selected.discord"
            :value="selected.discord"
            v-model="updatedMember.discord"
          ></v-text-field>

          <v-text-field
            variant="filled"
            density="compact"
            label="Data de registro"
            type="text"
            single-line
            :placeholder="selected.registrationDate"
            :value="selected.registrationDate"
            v-model="updatedMember.registrationDate"
          ></v-text-field>

          <v-textarea
            variant="filled"
            density="compact"
            label="Sobre (em inglês)"
            auto-grow
            :placeholder="selected.about"
            :value="selected.about"
            v-model="updatedMember.about"
          ></v-textarea>

          <v-textarea
            variant="filled"
            density="compact"
            label="Sobre (em português)"
            auto-grow
            :placeholder="selected.aboutPortuguese"
            :value="selected.aboutPortuguese"
            v-model="updatedMember.aboutPortuguese"
          ></v-textarea>

          <v-textarea
            variant="filled"
            density="compact"
            label="Notas do RH"
            auto-grow
            :placeholder="selected.notes"
            :value="selected.notes"
            v-model="updatedMember.notes"
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
            <v-btn
              style="margin-left: 10px;"
              color="yellow"
              @click="() => {
                ready = false;
              }"
              >Cancelar</v-btn
            >
          </div>

        </div>
      </div>

      <div v-else>
        <h1>Precisam de orientação espiritual:</h1>
        
        <v-chip v-if="notVerified.length > 0">{{ notVerified.length }} {{ notVerified.length > 1 ? "pessoas" : "pessoa" }}</v-chip>
        <div class="members" v-if="notVerified.length > 0">

          <div
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

        </div>
        
        <div v-else my-5>
          <h2>Não há ninguém para ser convertido atualmente.</h2>
        </div>

        <v-divider style="margin: 10px 0;"></v-divider>

        <div class="full">
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


        <div class="filter">
          <button 
            style="border-radius: 5px;"            
            class="px-4 py-2 mr-2 border"
            @click="filterByRole(null)"
            :class="selectedRole == null ? 'bg-primary' : ''"
          >
            Todos
          </button>

          <button 
            v-for="role in roles"
            :key="role"
            style="border-radius: 5px;"              
            class="px-4 py-2 mr-2 border"
            @click="filterByRole(role)"
            :class="selectedRole == role ? 'bg-primary' : ''"
          >
            {{ role }}
          </button>
        </div>

        <!-- all members div -->
        <v-chip class="mt-4">{{ selectedMembers.length }} {{ selectedMembers.length == 0 ? ':(' : 'devs'}}</v-chip>
        <div class="members">
          <div
            class="memberCard"
            v-for="(member, i) in selectedMembers"
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

        </div>
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
  saveMemberId
} from "../database";
import { Member, memberBoilerplate } from "../helpers/interfaces";
import { read } from "fs";

const members = ref<Member[]>([]);
const index = ref<number>(-1);
const notVerified = ref<Member[]>([]);

const selectedMember = ref<string>();
const selectedMembers = ref<Member[]>([]);
const selectedRole = ref<string | null>();
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

function filterByRole(role: string | null) {
  selectedRole.value = role;
  if (role === null) {
    selectedMembers.value = members.value.filter((m) => m.verified === true);
  } else {
    selectedMembers.value = members.value.filter((member) => {
      return member.roles.includes(role) && member.verified === true;
    });
  }
}


function addNewMember() {
  function generateRandomName() {
    const names = [
      "João",
      "Maria",
      "José",
      "Pedro",
      "Paulo",
      "Antônio",
      "Carlos",
      "Luiz",
      "Marcos",
      "Ricardo",
      "Rafael",
      "Júlio",
      "Jorge",
      "Miguel",
      "Rodrigo",
      "Gustavo",
      "Lucas",
    
    ];
    const lastNames = [
      "Silva",
      "Santos",
      "Souza",
      "Oliveira",
      "Rodrigues",
      "Almeida",
      "Pereira",
      "Nascimento",
      "Lima",
      "Fernandes",
      "Araújo",
      "Martins",
      "Gonçalves",
      "Ribeiro",
      "Costa",
      "Correia",
      "Carvalho",
      "Pinto",
      "Gomes",
      "Jesus",
      "Melo",
      "Barbosa",
      "Sousa",
      "Rocha",
      "Alves",
      "Teixeira",
      "Dias",
      "Rezende",
      "Moreira",
      "Cavalcanti",
      "Monteiro",
      "Azevedo",
      "Ferreira",
      "Ramos",
      "Nogueira",
      "Neves",
      "Barros",
      "Andrade",
      "Cruz",
      "Campos",
      "Soares",
      "Vieira",
      "Leite",
      "Santana",
      "Pereira",
      "Mendes",
      "Cardoso",
      "Vasconcelos",
      "Cunha",
      "Farias",
      "Marques",
      "Pinto",
      "Sampaio",
    ]
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return randomName + " " + randomLastName;
  }

  const randomName = generateRandomName();
  const memberRef = addMember(randomName);
  memberRef.then((id) => {
    members.value.push({
      id: id,
      name: randomName,
      age: "",
      email: "",
      discord: "",
      registrationDate: "",

      head: false,
      pronouns: "",
      about: "",
      aboutPortuguese: "",
      notes: "",

      roles: [],
      links: [''],
      images: [''],
      profilePicture: "",
      verified: false,
    });
    saveMemberId(id, randomName);
    selectMemberByIndex(members.value.length - 1);

    notVerified.value = members.value.filter((m) => m.verified === false);
    snackbarAdd.value = true;
  });

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

  selectedMembers.value = members.value;
  let pfp = member.profilePicture;

  if (member.profilePicture == "") {
    pfp = "https://cdn.discordapp.com/attachments/1002714469945835633/1079841194089123961/image.png";
  }

  saveMember({
    id: member.id,
    name: member.name,
    age: member.age,
    email: member.email,
    discord: member.discord,
    registrationDate: member.registrationDate,

    head: member.head,
    pronouns: member.pronouns,
    about: member.about,
    aboutPortuguese: member.aboutPortuguese,
    roles: member.roles,

    notes: member.notes,
    links: member.links,
    images: member.images,
    profilePicture: pfp,
    verified: member.verified,
  });
  
  notVerified.value = members.value.filter((m) => m.verified === false);
  snackbarSave.value = true;
  ready.value = false;
}

function deleteSelectedMember(id: string) {
  deleteMember(id);
  members.value = members.value.filter((m) => m.id !== id);
  notVerified.value = members.value.filter((m) => m.verified === false);
  selectedMembers.value = members.value;
  snackbarDelete.value = true;
  ready.value = false;
}

onMounted(async () => {
  await getMembers().then((data) => {
        for (let i in data) {
              console.log(data[i].verified)
                    members.value.push({

  })then((data) => {
    for (let i in data) {
      console.log(data[i].verified)
      members.value.push({
        id: "",
        verified: data[i].verified,
        head: data[i].head,
        email: data[i].email,
        discord: data[i].discord,
        registrationDate: data[i].registrationDate,

        name: data[i].name,
        pronouns: data[i].pronouns,
        age: data[i].age,
        profilePicture: data[i].profilePicture,
        about: data[i].about,
        aboutPortuguese: data[i].aboutPortuguese,

        notes: data[i].notes,

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
          discord: data[i].discord,
          registrationDate: data[i].registrationDate,

          name: data[i].name,
          pronouns: data[i].pronouns,
          age: data[i].age,
          profilePicture: data[i].profilePicture,
          about: data[i].about,
          aboutPortuguese: data[i].aboutPortuguese,

          notes: data[i].notes,

          roles: data[i].roles,
          links: data[i].links,
          images: data[i].images,
        });
      }
    }
    // add verified members to selected members
    selectedMembers.value = members.value.filter((m) => m.verified === true);
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
  padding: 0 20px;
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
  max-width: 45%;
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
  display: grid;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;

  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 20px;
}

.full {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>
