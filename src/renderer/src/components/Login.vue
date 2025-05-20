<template>
  <div class="login-wrapper">
    <v-container fill-height class="login-container">
      <v-row justify="center" align="center" style="height: 100vh">
        <v-col cols="12" sm="8" md="4">
          <v-card class="pa-6 login-card" flat>
            <v-card-title class="text-h5 text-center mb-6">Login</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="handleLogin">
                <v-text-field
                  v-model="email"
                  label="Email"
                  variant="outlined"
                  density="comfortable"
                  class="mb-4"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="Senha"
                  type="password"
                  variant="outlined"
                  density="comfortable"
                  class="mb-6"
                  required
                ></v-text-field>
                <v-btn
                  block
                  color="primary"
                  type="submit"
                  size="large"
                  class="text-none"
                >
                  Entrar
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        :timeout="timeout"
        location="top"
      >
        {{ snackbarMessage }}
        <template #action="{ attrs }">
          <v-btn
            variant="text"
            v-bind="attrs"
            @click="snackbar = false"
            class="text-none"
          >
            Fechar
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import enviroments from '../../enviroments'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const email = ref('')
    const password = ref('')
    const snackbar = ref(false)
    const snackbarMessage = ref('')
    const snackbarColor = ref('error')
    const timeout = ref(2000)

    return {
      email,
      password,
      snackbar,
      snackbarMessage,
      snackbarColor,
      timeout
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post(`${enviroments.API}/auth/login`, {
          email: this.email,
          password: this.password
        })

        if (response.status !== 200) {
          this.snackbarMessage = 'Usuário ou senha inválidos'
          this.snackbarColor = 'error'
          this.snackbar = true
          return
        }

        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Redimensiona a janela antes de navegar
        await window.electron.ipcRenderer.invoke('resize-window')
        
        this.$router.push('/home')
      } catch (error) {
        if (error.response && error.response?.status === 401) {
          this.snackbarMessage = 'Usuário ou senha inválidos'
        } else {
          this.snackbarMessage = 'Erro ao realizar login. Tente novamente.'
        }
        this.snackbarColor = 'error'
        this.snackbar = true
      }
    }
  }
})
</script>

<style scoped>
.login-wrapper {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}

.login-container {
  background-color: #fafafa;
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
  -webkit-app-region: drag;
}

.login-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  -webkit-app-region: no-drag;
}

.v-btn, .v-text-field {
  -webkit-app-region: no-drag;
}
</style>
