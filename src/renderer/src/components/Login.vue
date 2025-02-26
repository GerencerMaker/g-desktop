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
  </v-container>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const email = ref('')
    const password = ref('')

    return {
      email,
      password
    }
  },
  methods: {
    handleLogin() {
      alert(`Usuário: ${this.email}\nSenha: ${this.password}`)
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
