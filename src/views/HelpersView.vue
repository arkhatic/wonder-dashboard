<template>
  <div class="container">
    <v-snackbar v-model="snackbar" :timeout="3000" color="success">
      Textos salvos com sucesso!

      <template v-slot:actions>
        <v-btn color="success" variant="flat" @click="snackbar = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>

    <v-navigation-drawer permanent color="#000000" class="projectsSelectorContainer">
      <v-list rounded="lg" density="compact" nav>
        <!-- insert a header in the nav -->
        <v-list-subheader>Textos</v-list-subheader>
        <v-list-item  
          density="compact"
          title="Contact View"
          value="contact"
          prepend-icon="mdi-projector-screen"
          @click="() => { select(0) }"
        >
        </v-list-item>
        <v-list-item  
          density="compact"
          title="Join Us View"
          value="join"
          prepend-icon="mdi-projector-screen"
          @click="() => { select(1) }"
        >
        </v-list-item>
        <v-list-item  
          density="compact"
          title="Team View"
          value="team"
          prepend-icon="mdi-projector-screen"
          @click="() => { select(2) }"
        >
        </v-list-item>
        <v-list-item  
          density="compact"
          title="Workforce View"
          value="Workforce"
          prepend-icon="mdi-projector-screen"
          @click="() => { select(4) }"
        >
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item
          density="compact"
          prepend-icon="mdi-toolbox"
          title="Cargos"
          value="Cargos"
          @click="() => { select(3) }"
        >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <div class="mainContainer">
      <div 
        v-if="selectedIndex === 0"
        class="textsWrapper"
      >
        <v-textarea
          v-for="(value, key, index) in contactTexts"
          :label="key"
          v-model="contactTexts[key]"
          :value="value"
          class="textArea"
          :key="index"
        ></v-textarea>

        <v-btn
          color="sucess"
          class="saveButton"
          @click="() => { editText('contactView', contactTexts); snackbar = true }"
        >
          Salvar
        </v-btn>
      </div>

      <div 
        v-if="selectedIndex === 1"
        class="textsWrapper"
      >
        <v-textarea
          v-for="(value, key, index) in joinTexts"
          :label="key"
          v-model="joinTexts[key]"
          :placeholder="value"
          class="textArea"
          :key="index"
        ></v-textarea>

        <v-btn
          color="sucess"
          class="saveButton"
          @click="() => { editText('joinUsView', joinTexts); snackbar = true }"
        >
          Salvar
        </v-btn>

      </div>

      <div 
        v-if="selectedIndex === 2"
        class="textsWrapper"
      >
        <v-textarea
          v-for="(value, key, index) in teamTexts"
          :label="key"
          v-model="teamTexts[key]"
          :value="value"
          class="textArea"
          :key="index"
        ></v-textarea>

        <v-btn
          color="sucess"
          class="saveButton"
          @click="() => { editText('teamView', teamTexts); snackbar = true }"
        >
          Salvar
        </v-btn>
      </div>

      <div 
        v-if="selectedIndex === 3"
        class="textsWrapper"
      >
        <v-text-field
          v-for="(role, index) in roles"
          :label="'Role #' + index"
          v-model="roles[index]"
          class="textArea"
          :key="index"
          prepend-inner-icon="mdi-minus"
          @click:prepend-inner="() => {
            roles.splice(index, 1)
          }"
        ></v-text-field>

        <v-btn
          color="sucess"
          class="saveButton"
          @click="() => { editRoles('roles', roles) }"
        >
          Salvar
        </v-btn>

        <v-btn
          color="sucess"
          class="saveButton"
          style="margin-left: 10px;"
          @click="() => { roles.push('') }"
        >
          Novo
        </v-btn>

        
      </div>

      <div 
        v-if="selectedIndex === 4"
        class="textsWrapper"
      >
        <v-textarea
          v-for="(value, key, index) in workforceTexts"
          :label="key"
          v-model="workforceTexts[key]"
          :value="value"
          class="textArea"
          :key="index"
        ></v-textarea>

        <v-btn
          color="sucess"
          class="saveButton"
          @click="() => { editText('teamView', workforceTexts); snackbar = true }"
        >
          Salvar
        </v-btn>
      </div>
    </div>
        
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  getAllRoles, getAllTexts, editRoles, editText,
  getContactText, getJoinText, getTeamText  
} from '@/database';

// constants
const snackbar = ref<boolean>(false);
const roles = ref<string[]>([]);
const contactTexts = ref<{ [key: string]: string }>({});
const joinTexts = ref<{ [key: string]: string }>({});
const teamTexts = ref<{ [key: string]: string }>({});
const workforceTexts = ref<{ [key: string]: string }>({});

const newContactText = ref<{ [key: string]: string }>({});

const selectedIndex = ref<number>(-1);

// functions
function select(index: number) {
  selectedIndex.value = index;
}

// methods
onMounted(async () => {
  await getAllRoles().then((data) => {
    for (let i in data) {
      for (let j in data[i]) {
        for (let k in data[i][j]) {
          roles.value.push(data[i][j][k]);
        }
      }
    }
  });

  await getAllTexts().then((data) => {
    for (let i = 0; i < data.length; i++) {
      if (i == 0) {
        for (let j in data[i]) {
          contactTexts.value[j] = data[i][j];
        }
      } else if (i == 1) {
        for (let j in data[i]) {
          joinTexts.value[j] = data[i][j];
        }
      } else if (i == 3) {
        for (let j in data[i]) {
          teamTexts.value[j] = data[i][j];
        }
      } else if (i == 4) {
        for (let j in data[i]) {
          workforceTexts.value[j] = data[i][j];
        } 
      }
    }
  });
  console.log(roles.value);
  console.log(contactTexts.value);
  console.log(joinTexts.value);
  console.log(teamTexts.value);
});
</script>

<style scoped>
.mainContainer {
  height: 100vh;
  overflow-y: scroll;
  padding: 15px;
}
.container {
  height: fit-content;
  padding: 5px 15px;
  overflow-y: scroll;
}



</style>
