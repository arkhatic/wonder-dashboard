<template>
  <v-snackbar v-model="snackbarAdd" :timeout="3000" color="success">
    Projeto adicionado com sucesso!

    <template v-slot:actions>
      <v-btn color="success" variant="flat" @click="snackbarAdd = false">
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
  <v-snackbar v-model="snackbarSaved" :timeout="3000" color="success">
    Projeto salvo com sucesso!

    <template v-slot:actions>
      <v-btn color="success" variant="flat" @click="snackbarSaved = false">
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
  <v-snackbar v-model="snackbarDeleted" :timeout="3000" color="error">
    Projeto deletado com sucesso!

    <template v-slot:actions>
      <v-btn color="error" variant="flat" @click="snackbarDeleted = false">
        Fechar
      </v-btn>
    </template>
  </v-snackbar>

  <div class="container">
    <v-navigation-drawer permanent color="#000000" class="projectsSelectorContainer">
      <v-list rounded="lg" density="compact" nav>
        <v-list-item
        
          nav density="compact"
          class="selectorText"
          v-for="(project, i) in projects"
          :key="project.name"
          :title="project.name"
          :value="project.name"
          prepend-icon="mdi-projector-screen"
          @click="selectProject(i)"
        >
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          nav density="compact"
          prepend-icon="mdi-plus"
          title="Novo projeto"
          value="addNewProject"
          @click="addNewProject"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    
    <div class="projectsContainer" >
      <div v-if="loading" class="projectContentContainer">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>

      <div v-if="!loading" class="projectContentContainer">
        <div v-if="index >= 0" class="projectContentWrapper">
          <div class="projectContent">
            <v-card-title
              class="text-h6 font-weight-regular justify-space-between mt-2"
            >
              <h1>{{ projects[index].name }}</h1>
              <span class="text-caption text-grey-darken-1">
                ID: {{ projects[index].id }}
              </span>
            </v-card-title>

            <v-divider></v-divider>
            <div class="window">
              <v-window class="overflow-y" v-model="step">
                <v-window-item :value="1" class="overflow-auto">
                  <v-card-text class="overflow-auto">
                    <h2>{{ projects[index].description }}</h2>
                    <span class="text-caption text-grey-darken-1">
                      Descrição do projeto
                    </span>

                    <v-divider class="my-4"></v-divider>

                    <img class="coverImage" :src="projects[index].coverImage" />
                    <br />
                    <span class="text-caption text-grey-darken-1">
                      Imagem do projeto
                    </span>

                    <v-divider class="my-4"></v-divider>

                    <h2>Membros do projeto</h2>
                    <div
                      elevation="2"
                      class="membersWrapper"
                    >
                      <div
                        class="memberCard"
                        v-for="(member, i) in projectMembers"
                        :key="member.name"
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
                  </v-card-text>
                </v-window-item>

                <v-window-item :value="2">
                  <v-card-text>
                    <v-text-field
                      label="Nome do projeto"
                      :placeholder="projects[index].name"
                      type="text"
                      v-model="projects[index].name"
                    ></v-text-field>
                    <v-text-field
                      label="Descrição do projeto em inglês"
                      type="text"
                      :placeholder="projects[index].description"
                      v-model="projects[index].description"
                    ></v-text-field>
                    <v-text-field
                      label="Descrição do projeto em português"
                      type="text"
                      :placeholder="projects[index].descriptionPortuguese"
                      v-model="projects[index].descriptionPortuguese"
                    ></v-text-field>
                    <v-text-field
                      label="Link da imagem do projeto"
                      type="text"
                      :placeholder="projects[index].coverImage"
                      v-model="projects[index].coverImage"
                    ></v-text-field>
                    
                    <!-- make a selectable members area -->
                    <v-divider class="my-4"></v-divider>

                    <v-autocomplete
                      v-model="membersToAdd"
                      :items="members"
                      chips
                      closable-chips
                      color="blue-grey-lighten-2"
                      item-title="name"
                      item-value="name"
                      label="Selecione os membros do projeto"
                      multiple
                    >
                      <template v-slot:chip="{ props, item }">
                        <v-chip
                          v-bind="props"
                          :prepend-avatar="item.raw.profilePicture"
                          :text="item.raw.name"
                        ></v-chip>
                      </template>

                      <template v-slot:item="{ props, item }">
                        <v-list-item
                          v-bind="props"
                          :prepend-avatar="item?.raw?.profilePicture"
                          :title="item?.raw?.name"
                          :subtitle="item?.raw?.roles[0]"
                        ></v-list-item>
                      </template>
                    </v-autocomplete>


                    
                  </v-card-text>
                </v-window-item>

                <v-window-item :value="3">
                  <div class="areYouSure">
                    <div>
                      <h1>Tem certeza que deseja editar este projeto?</h1>
                      <v-btn
                        color="success"
                        class="white--text mr-4"
                        @click="saveProject()"
                      >
                        <v-icon class="mr-3">mdi-grease-pencil</v-icon>
                        Sim.
                      </v-btn>

                      <v-btn color="error" class="white--text" @click="step--">
                        <v-icon class="mr-3">mdi-chevron-left</v-icon>
                        Não.
                      </v-btn>
                    </div>
                  </div>
                </v-window-item>

                <v-window-item :value="4">
                  <div class="pa-4 h-100 text-center">
                    <h1>
                      Tem certeza que deseja <strong>deletar</strong> este projeto?
                    </h1>

                    <v-btn
                      color="error"
                      class="white--text mr-4"
                      @click="deleteExistingProject(projects[index].id)"
                    >
                      <v-icon class="mr-3">mdi-delete</v-icon>
                      Sim.
                    </v-btn>

                    <v-btn color="success" class="white--text" @click="step -= 2">
                      <v-icon class="mr-3">mdi-chevron-left</v-icon>
                      Não.
                    </v-btn>
                  </div>
                </v-window-item>
              </v-window>
            </div>

          </div>

          <div class="projectActions">
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                v-if="step === 2"
                color="primary"
                variant="flat"
                @click="step--"
              >
                Cancel
              </v-btn>
              <v-btn
                v-else-if="step === 1"
                color="error"
                variant="flat"
                @click="step = 4"
              >
                Delete project
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                v-if="step === 1"
                color="primary"
                variant="flat"
                @click="step++"
              >
                Edit
              </v-btn>
              <v-btn
                v-if="step === 2"
                color="success"
                variant="flat"
                @click="step++"
              >
                Done
              </v-btn>
            </v-card-actions>
          </div>
        </div>

        <div class="selectProjectDialog">
          <h1>Por favor, selecione um projeto primeiro.</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getProjects,
  getMembers,
  getMember,
  getMemberId,
  addProject,
  editProject,
  deleteProject,
  getProjectId,
} from "@/database";
import { Project, Member } from "../helpers/interfaces";
import { DocumentData } from "@firebase/firestore";

// custom variables
const projects = ref<Project[]>([]);
const members = ref<Member[]>([]);
const loading = ref(true);
const index = ref<number>(-1);

const snackbarAdd = ref(false);
const snackbarSaved = ref(false);
const snackbarDeleted = ref(false);
const snackbarMemberAdded = ref(false);
const snackbarMemberDeleted = ref(false);

const projectMembers = ref<Member[]>([]);
const membersToAdd = ref<string[]>([]);

const step = ref(1);

// custom methods
function addNewProject() {
  const newProjectRef = addProject();
  newProjectRef.then((id) => {
    projects.value.push({
      id: id,
      name: "",
      description: "",
      descriptionPortuguese: "",
      coverImage: "",
      members: [],
    });
    selectProject(projects.value.length - 1);
  });
  snackbarAdd.value = true;
}

function deleteExistingProject(id: string) {
  snackbarDeleted.value = true;
  index.value = -1;
  step.value = -1;
  projects.value.splice(index.value, 1);
  deleteProject(id);
}

function saveProject() {
  snackbarSaved.value = true;

  let membersIds: string[] = [];

  for (let i in membersToAdd.value) {
    getMemberId(membersToAdd.value[i]).then((member) => {
      membersIds.push(member);
    })
  }

  console.log(membersToAdd)
  console.log(membersIds)


  editProject({
    id: projects.value[index.value].id,
    name: projects.value[index.value].name,
    description: projects.value[index.value].description,
    descriptionPortuguese: projects.value[index.value].descriptionPortuguese,
    coverImage: projects.value[index.value].coverImage,
    members: membersIds,
  });

  projects.value[index.value].members = membersIds;

  step.value = -1;
  index.value = -1;
}

function selectProject(i: number) {
  step.value = 1;
  index.value = i;

  membersToAdd.value = [];
  projectMembers.value = [];

  for (let i in projects.value[index.value].members) {
    getMember(projects.value[index.value].members[i]).then((member) => {
      membersToAdd.value.push(member.name);
      projectMembers.value.push(member);
    });
  }
}

// vue methods
onMounted(async () => {
  await getMembers().then((data) => {
    for (let i in data) {
      members.value.push({
        id: data[i].id,
        verified: data[i].verified,
        head: data[i].head,
        email: data[i].email,

        name: data[i].name,
        pronouns: data[i].pronouns,
        age: data[i].age,
        profilePicture: data[i].profilePicture,
        about: data[i].about,
        aboutPortuguese: data[i].aboutPortuguese,

        roles: data[i].roles,
        links: data[i].links,
        images: data[i].images,
      });
      getMemberId(data[i].name).then((id) => {
        members.value[i].id = id;
      });
    }
  });

  await getProjects().then((data) => {
    for (let i in data) {
      const d = data[i];

      projects.value.push({
        name: d.name,
        description: d.description,
        descriptionPortuguese: d.descriptionPortuguese,
        coverImage: d.coverImage,
        members: d.members,
        id: ""
      });

      getProjectId(d.name).then((id) => {
        projects.value[i].id = id;
      });
    }
  });
  loading.value = false;
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: row;
}

.projectsSelectorContainer {
  background-color: #000000;
  height: 100vh;
  width: 300px;
  padding: 0 10px;
  border-right: 1px solid #303030;
}

.projectsContainer {
  background-color: #000000;
  height: 100vh;
  width: 100%;
}

.projectContentContainer {
  background-color: #000000;
  height: 100vh;
  width: 100%;
}

.selectProjectDialog {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 25%;
  text-align: center;
  /* background error */
  background: #131313;
}

.projectContentWrapper {
  display: grid;
  height: 100%;
  /* make two columns, one of 1fr and other of 50px */
  grid-template-rows: calc(100vh - 50px) 50px;
}

.projectContent {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.projectActions {
  height: fit-content;
  position: relative;
}

.window {
  overflow: scroll;
  height: 100%;
  width: 100%;
}

.areYouSure {
  height: calc(100vh - 150px);
  padding: 0 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.membersWrapper {
  display: grid;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 15px;

  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 10px;
}

.areYouSure div {
  height: fit-content;
}

.coverImage {
  width: 70%;
}

.memberCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  padding: 10px;
  background-color: #111111;

  width: 200px;
  height: 200px;

  border-radius: 10px;
}

.memberCard img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.selectorText {
  background: #000;
}
</style>