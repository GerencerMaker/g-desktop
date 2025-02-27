<template>
  <v-container fill-height>
    <v-row justify="center" align="center" style="height: 100vh">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-5" elevation="5">
          <v-card-title class="text-h5 text-center">Login</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field v-model="email" label="Email" outlined required> </v-text-field>
              <v-text-field v-model="password" label="Senha" type="password" outlined required>
              </v-text-field>
              <v-btn block color="primary" type="submit">Entrar</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="timeout">
      {{ snackbarMessage }}
      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
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
    const snackbarColor = ref('error') // Cor da snackbar (pode ser 'error', 'success', etc.)
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
        this.$router.push('/home')
      } catch (error) {
        if (error.response && error.response.status === 401) {
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
.v-container {
  background-color: #f4f4f4;
  min-height: 100vh;
}
</style>
