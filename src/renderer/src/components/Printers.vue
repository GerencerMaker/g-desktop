<script>
import { defineComponent, reactive, ref } from 'vue'
import axios from 'axios'

export default defineComponent({
  name: 'PrinterSelection',
  data() {
    return {
      systemPrinters: reactive([]),
      selectedPrinters: ref([])
    }
  },
  mounted() {
    this.listPrinters()
  },
  methods: {
    async listPrinters() {
      try {
        const printerList = await window.electron.ipcRenderer.invoke('list-printers')
        this.systemPrinters.splice(
          0,
          this.systemPrinters.length,
          ...printerList.map((p) => ({
            id: p.options['printer-uri-supported'],
            name: p.name,
            ip: p.options['printer-uri-supported'],
            status: p.status,
            default: p.options['printer-uri-supported'] === 'ipp://localhost/printers/IMPRESSORA'
          }))
        )
      } catch (error) {
        console.error('Erro ao listar impressoras:', error)
      }
    },
    async submitPrinters() {
      if (this.selectedPrinters.length === 0) {
        alert('Selecione pelo menos uma impressora!')
        return
      }

      try {
        await axios.post('/api/select-printers', { printerIds: this.selectedPrinters })
        alert('Impressoras selecionadas com sucesso!')
      } catch (error) {
        console.error('Erro ao enviar as impressoras:', error)
        alert('Erro ao selecionar as impressoras.')
      }
    }
  }
})
</script>

<template>
  <v-container>
    <v-container v-for="systemPrinter in systemPrinters" :key="systemPrinter.id">
      <v-card class="pa-3 mb-2">
        <v-row>
          <v-col>
            <h2>{{ systemPrinter.name }}</h2>
            <ul>
              <li>Status: {{ systemPrinter.status }}</li>
              <li>IP: {{ systemPrinter.ip }}</li>
              <li v-if="systemPrinter.default">Padrão</li>
            </ul>
          </v-col>
          <v-col class="d-flex align-end justify-end">
            <v-checkbox
              v-model="selectedPrinters"
              :value="systemPrinter.id"
              class="mt-0"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card>
    </v-container>

    <v-btn color="primary" @click="submitPrinters">Confirmar Seleção</v-btn>
  </v-container>
</template>

<style scoped>
h2 {
  color: #333;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 5px 0;
}
</style>
