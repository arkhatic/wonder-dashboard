<template>
  <v-snackbar v-model="snackbarAdd" :timeout="3000" color="success">
    Project added successfully!

    <template v-slot:actions>
      <v-btn color="success" variant="flat" @click="snackbarAdd = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-snackbar v-model="snackbarMemberAdded" :timeout="1000" color="success">
    Member added successfully!

    <template v-slot:actions>
      <v-btn
        color="success"
        variant="flat"
        @click="snackbarMemberAdded = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-snackbar v-model="snackbarMemberDeleted" :timeout="1000" color="error">
    Member deleted successfully!

    <template v-slot:actions>
      <v-btn
        color="error"
        variant="flat"
        @click="snackbarMemberDeleted = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-snackbar v-model="snackbarSaved" :timeout="3000" color="success">
    Project saved successfully!

    <template v-slot:actions>
      <v-btn color="success" variant="flat" @click="snackbarSaved = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-snackbar v-model="snackbarDeleted" :timeout="3000" color="error">
    Project deleted successfully!

    <template v-slot:actions>
      <v-btn color="error" variant="flat" @click="snackbarDeleted = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>

  <div class="container">
    <div class="projectsSelectorContainer">
      <v-list rounded="lg">
        <v-list-subheader>
          <v-icon>mdi-projector-screen</v-icon>
          Projetos
        </v-list-subheader>

        <v-list-item
          v-for="(project, i) in projects"
          :key="project.name"
          :title="project.name"
          :value="project.name"
          @click="selectProject(i)"
        ></v-list-item>

        <v-divider></v-divider>

        <v-list-item
          prepend-icon="mdi-plus"
          title="Novo projeto"
          value="addNewProject"
          @click="addNewProject"
        >
        </v-list-item>
      </v-list>
      <!-- </div> -->
    </div>

    
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

                    <v-img class="coverImage" :src="projects[index].coverImage"></v-img>
                    <span class="text-caption text-grey-darken-1">
                      Imagem do projeto
                    </span>

                    <v-divider class="my-4"></v-divider>

                    <div
                      elevation="2"
                      class="membersWrapper"
                    >
                      <h2>Membros do projeto</h2>
                      <v-window class="overflow-auto">
                        <v-window-item :value="1" class="overflow-auto">
                          <v-list>
                            <v-list-item
                              selectable="false"
                              v-for="(member, i) in projects[index].members"
                              :key="member.name"
                              :value="member.name"
                            >
                              <v-row
                                align="center"
                                class="spacer rounded"
                                no-gutters
                              >
                                <v-col cols="3" sm="2" md="1">
                                  <v-avatar size="36px">
                                    <v-img
                                      alt="Avatar"
                                      :src="member.profilePicture"
                                    ></v-img>
                                  </v-avatar>
                                </v-col>

                                <v-col
                                  class="hidden-xs-only text-left ml-2"
                                  sm="5"
                                  md="3"
                                >
                                  <strong v-html="member.name"></strong>
                                </v-col>

                                <v-col
                                  class="text-no-wrap text-left"
                                  cols="5"
                                  sm="3"
                                >
                                  <v-chip class="ml-0 mr-2" label small>
                                    {{ member.role }}
                                  </v-chip>
                                </v-col>
                              </v-row>
                              <v-divider v-if="i < projects.length" class="my-2" ></v-divider>
                            </v-list-item>
                          </v-list>
                        </v-window-item>
                      </v-window>
                    </div>
                  </v-card-text>
                </v-window-item>

                <v-window-item :value="2">
                  <v-card-text>
                    <v-text-field
                      label="New project name"
                      :placeholder="projects[index].name"
                      type="text"
                      v-model="projects[index].name"
                    ></v-text-field>
                    <v-text-field
                      label="New project description"
                      type="text"
                      :placeholder="projects[index].description"
                      v-model="projects[index].description"
                    ></v-text-field>
                    <v-text-field
                      label="New project cover image link"
                      type="text"
                      :placeholder="projects[index].coverImage"
                      v-model="projects[index].coverImage"
                    ></v-text-field>

                    <v-list select-strategy="single-independent">
                      <v-btn
                        color="primary"
                        class="white--text"
                        @click="addNewMember()"
                      >
                        <v-icon class="mr-3">mdi-plus</v-icon>
                        Add new member
                      </v-btn>

                      <v-list-item
                        v-for="(member, i) in projects[index].members"
                        class="mt-5 py-4 rounded bg-secondary"
                        :key="i"
                        :value="i"
                      >
                        <v-list-item-subtitle class="mb-2"
                          >Member {{ i + 1 }}</v-list-item-subtitle
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
                          @click="deleteMember(i)"
                        >
                          <v-icon class="mr-3">mdi-delete</v-icon>
                          Remove member
                        </v-btn>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-window-item>

                <v-window-item :value="3">
                  <div class="areYouSure">
                    <div>
                      <h1>Are you sure you want to edit the project?</h1>
                      <v-btn
                        color="success"
                        class="white--text mr-4"
                        @click="saveProject()"
                      >
                        <v-icon class="mr-3">mdi-grease-pencil</v-icon>
                        Yes I am.
                      </v-btn>

                      <v-btn color="error" class="white--text" @click="step--">
                        <v-icon class="mr-3">mdi-chevron-left</v-icon>
                        No, I am not.
                      </v-btn>
                    </div>
                  </div>
                </v-window-item>

                <v-window-item :value="4">
                  <div class="pa-4 h-100 text-center">
                    <h1>
                      Are you sure you want to <strong>delete</strong> this
                      project?
                    </h1>

                    <v-btn
                      color="error"
                      class="white--text mr-4"
                      @click="deleteExistingProject(projects[index].id)"
                    >
                      <v-icon class="mr-3">mdi-delete</v-icon>
                      Yes I am.
                    </v-btn>

                    <v-btn color="success" class="white--text" @click="step -= 2">
                      <v-icon class="mr-3">mdi-chevron-left</v-icon>
                      No, I am not.
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
  getHead,
  addProject,
  Member,
  Project,
  NewProject,
  editProject,
  deleteProject,
  getProjectId,
} from "@/database";
import { DocumentData } from "@firebase/firestore";

const projects = ref<NewProject[]>([]);
const head = ref<Member[]>([]);
const loading = ref(true);
const index = ref<number>(-1);

const snackbarAdd = ref(false);
const snackbarSaved = ref(false);
const snackbarDeleted = ref(false);
const snackbarMemberAdded = ref(false);
const snackbarMemberDeleted = ref(false);

const step = ref(1);

const projectBoilerplate: Project = {
  name: "Project name",
  description: "A brief description about the project.",
  coverImage: "The link for the cover image.",
  members: [
    {
      name: 'Name "Nickname"',
      profilePicture:
        "https://aniyuki.com/wp-content/uploads/2022/03/aniyuki-anime-girl-avatar-51.jpg",
      role: "Role Role",
    },
  ],
};

function addNewProject() {
  const newProjectRef = addProject(projectBoilerplate);
  newProjectRef.then((id) => {
    projects.value.push({
      ...projectBoilerplate,
      id: id,
    });
    index.value = projects.value.length - 1;
  });
  snackbarAdd.value = true;
}

function addNewMember() {
  projects.value[index.value].members.push({
    name: 'Name "Nickname"',
    profilePicture:
      "https://aniyuki.com/wp-content/uploads/2022/03/aniyuki-anime-girl-avatar-51.jpg",
    role: "Role",
  });
  snackbarMemberAdded.value = true;
}

function deleteMember(indexMember: number) {
  projects.value[index.value].members.splice(indexMember, 1);
  snackbarMemberDeleted.value = true;
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
  editProject({
    name: projects.value[index.value].name,
    description: projects.value[index.value].description,
    coverImage: projects.value[index.value].coverImage,
    members: projects.value[index.value].members,
    id: projects.value[index.value].id,
  });

  step.value = -1;
  index.value = -1;
}

function selectProject(i: number) {
  step.value = 1;
  index.value = i;
}

const newProject = ref<NewProject>({
  name: "Name",
  description: "Description",
  coverImage:
    "https://assets.hongkiat.com/uploads/minimalist-dekstop-wallpapers/4k/original/14.jpg",
  members: [
    {
      name: 'Name "Nickname"',
      profilePicture:
        "https://aniyuki.com/wp-content/uploads/2022/03/aniyuki-anime-girl-avatar-51.jpg",
      role: "Role",
    },
  ],
  id: "",
});

function handleReload() {
  window.location.reload();
}

onMounted(async () => {
  await getHead().then((data) => {
    for (let i in data) {
      head.value.push({
        name: data[i].name,
        role: data[i].role,
        profilePicture: data[i].profilePicture,
      });
    }
  });

  await getProjects().then((data) => {
    for (let i in data) {
      const d = data[i];
      projects.value.push({
        name: d.name,
        description: d.description,
        coverImage: d.coverImage,
        members: d.members,
        id: "",
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
  background-color: #202020;
  height: 100vh;
  width: 300px;
  border-right: 1px solid #303030;
}

.projectsContainer {
  background-color: #202020;
  height: 100vh;
  width: 100%;
}

.projectContentContainer {
  background-color: #202020;
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
  background: #404040;
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

.areYouSure div {
  height: fit-content;
}

.coverImage {
  width: 100%;
  /* max-width: 500px; */
}
</style>