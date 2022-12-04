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

  <v-container>
    <v-row>
      <v-col cols="2">
        <v-sheet rounded="lg">
          <v-list rounded="lg">
            <v-list-subheader>
              <v-icon>mdi-projector-screen</v-icon>
              Projects list
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
              title="Add new project"
              value="addNewProject"
              @click="addNewProject"
            ></v-list-item>
          </v-list>
        </v-sheet>
      </v-col>

      <v-col v-if="!loading">
        <v-sheet rounded="lg" class="bg-grey-darken-4" style="height: 90vh">
          <v-card v-if="index >= 0" class="mx-auto pt-4 overflow-auto h-100">
            <v-card-title
              class="text-h6 font-weight-regular justify-space-between"
            >
              <h1>{{ projects[index].name }}</h1>
            </v-card-title>

            <v-window class="overflow-auto" v-model="step">
              <v-window-item :value="1" class="overflow-auto">
                <v-card-text class="overflow-auto">
                  <h2>{{ projects[index].description }}</h2>
                  <span class="text-caption text-grey-darken-1">
                    {{ projects[index].id }}
                  </span>

                  <v-divider class="my-4"></v-divider>

                  <v-img :src="projects[index].coverImage"></v-img>
                  <span class="text-caption text-grey-darken-1">
                    Project cover image.
                  </span>

                  <v-divider class="my-4"></v-divider>

                  <v-card
                    class="mx-auto pt-4 overflow-auto bg-grey-darken-3"
                    elevation="2"
                  >
                    <v-card-title
                      class="text-h6 font-weight-regular justify-space-between"
                    >
                      <h2>Project members</h2>
                    </v-card-title>

                    <v-window class="overflow-auto">
                      <v-window-item :value="1" class="overflow-auto">
                        <v-card-text class="overflow-auto">
                          <v-list rounded="lg">
                            <v-list-item
                              v-for="member in projects[index].members"
                              :key="member.name"
                              :value="member.name"
                            >
                              <v-row
                                align="center"
                                class="spacer rounded"
                                no-gutters
                              >
                                <v-col cols="3" sm="2" md="1">
                                  <v-avatar size="48px">
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
                                  <!-- <strong v-html="member.title"></strong> -->
                                </v-col>
                              </v-row>
                            </v-list-item>
                          </v-list>
                        </v-card-text>
                      </v-window-item>
                    </v-window>
                  </v-card>
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

                    <!-- make item not selectable -->

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
                        <!-- trash bin icon -->
                        <v-icon class="mr-3">mdi-delete</v-icon>
                        Remove member
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-window-item>

              <v-window-item :value="3">
                <div class="pa-4 h-100 text-center">
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
          </v-card>

          <v-card v-else class="text-center h-full w-full">
            <h1>Please select a project first.</h1>
          </v-card>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
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
  height: 100vh;
}
</style>