<template>
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
              v-for="project in projects"
              :key="project.name"
              :title="project.name"
              :value="project.name"
              @click="selectProject(project)"
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
          <v-card v-if="(index >= 0)" class="mx-auto pt-4 overflow-auto h-100">
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
                    v-model="newProjectName"
                  ></v-text-field>
                  <v-text-field
                    label="New project description"
                    type="text"
                    :placeholder="projects[index].description"
                    v-model="newProjectDescription"
                  ></v-text-field>
                  <v-text-field
                    label="New project cover image link"
                    type="text"
                    :placeholder="projects[index].coverImage"
                    v-model="newProjectCoverImage"
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
                      v-for="(member, i) in newProjectMembers"
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
                        @click="removeMember(i)"
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

                  <v-card-text>
                    <v-dialog v-model="dialogSuc" persistent>
                      <template v-slot:activator="{ props }">
                        <v-btn
                          color="success"
                          class="white--text mr-4"
                          @click="saveProject()"
                          v-bind="props"
                        >
                          <v-icon class="mr-3">mdi-grease-pencil</v-icon>
                          Yes I am.
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title class="text-h5">
                          Project added scessfully!
                        </v-card-title>
                        <v-card-text
                          >Now, you have to reload the page to fetch your changes.</v-card-text
                        >
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="green-darken-1"
                            variant="text"
                            @click="handleReload()"
                          >
                            Ok
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>

                    <v-btn color="error" class="white--text" @click="step--">
                      <v-icon class="mr-3">mdi-chevron-left</v-icon>
                      No, I am not.
                    </v-btn>
                  </v-card-text>
                </div>
              </v-window-item>

              <v-window-item :value="4">
                <div class="pa-4 h-100 text-center">
                  <h1>
                    Are you sure you want to <strong>delete</strong> this
                    project?
                  </h1>

                  <v-card-text>
                    <v-dialog v-model="dialogErr" persistent>
                      <template v-slot:activator="{ propsErr }">
                        <v-btn
                          color="error"
                          class="white--text mr-4"
                          @click="deleteExistingProject()"
                          v-bind="propsErr"
                        >
                          <v-icon class="mr-3">mdi-delete</v-icon>
                          Yes I am.
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title class="text-h5">
                          Project added scessfully!
                        </v-card-title>
                        <v-card-text
                          >Now, you have to reload the page to fetch your changes.</v-card-text
                        >
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="green-darken-1"
                            variant="text"
                            @click="handleReload()"
                          >
                            Ok
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>

                    <v-btn
                      color="success"
                      class="white--text"
                      @click="step -= 2"
                    >
                      <v-icon class="mr-3">mdi-chevron-left</v-icon>
                      No, I am not.
                    </v-btn>
                  </v-card-text>
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

          <v-card v-else>
            <h1>
              Please select a project first.
            </h1>
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
  deleteProject,
  Member,
  editProject,
  addProject,
} from "@/database";
interface NewProject {
  name: string;
  description: string;
  coverImage: string;
  members: Member[];
  id: string;
}

const projects = ref<NewProject[]>([]);
const projectSnapshot = ref<NewProject>({} as NewProject);
const head = ref<Member[]>([]);
const loading = ref(true);
const index = ref<number>(-1);

const dialogSuc = ref(false);
const dialogErr = ref(false);
const step = ref(1);

const newProjectName = ref("");
const newProjectDescription = ref("");
const newProjectCoverImage = ref("");
const newProjectMembers = ref<Member[]>([]);

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

function addNewProject() {
  const projectAddedId = addProject(newProject.value);
  projectAddedId.then((id) => {
    newProject.value.id = id;
  });
  projects.value.push(newProject.value);
  // reload page
}

function addNewMember() {
  newProjectMembers.value.push({
    name: "",
    role: "",
    profilePicture: "",
  });
}

function removeMember(i: number) {
  newProjectMembers.value.splice(i, 1);
}

function saveProject() {
  newProject.value.name = newProjectName.value;
  newProject.value.description = newProjectDescription.value;
  newProject.value.coverImage = newProjectCoverImage.value;
  newProject.value.members = newProjectMembers.value;

  editProject(newProject.value);
  // refresh page
}

function deleteExistingProject() {
  deleteProject(projects.value[index.value].id);
  projects.value.splice(index.value, 1);
  index.value = -1;
}

function selectProject(project: NewProject) {
  index.value = projects.value.indexOf(project);
  projectSnapshot.value = projects.value[index.value];
  newProjectName.value = projectSnapshot.value.name;
  newProjectDescription.value = projectSnapshot.value.description;
  newProjectCoverImage.value = projectSnapshot.value.coverImage;
  newProjectMembers.value = projectSnapshot.value.members;
  step.value = 1;
}

function handleReload() {
  window.location.reload();
}

onMounted(async () => {
  await getHead().then((data) => {
    for (let i in data) {
      head.value.push(data[i]);
    }
  });
  await getProjects().then((data) => {
    for (let i in data) {
      projects.value.push(data[i]);
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