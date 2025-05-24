<script>
import { defineComponent, ref } from 'vue'
import axios from 'axios'
import enviroments from '../../enviroments'

export default defineComponent({
  name: 'PrinterSelection',
  data() {
    return {
      systemPrinters: [],
      selectedPrinter: ref(null)
    }
  },
  mounted() {
    this.getPrinter();
    this.listPrinters();
  },

  methods: {
    async getPrinter() {
      try {
        const response = await axios.get(`${enviroments.API}/printer`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const backendPrinter = response.data.data;
        if (backendPrinter && backendPrinter.ip) {
          this.selectedPrinter = backendPrinter.ip;
        }
      } catch (error) {
        console.error('Erro ao buscar a impressora configurada:', error);
      }
    },


    async listPrinters() {
      try {
        const printerList = await window.electron.ipcRenderer.invoke('list-printers')
        this.systemPrinters = printerList.map((p) => ({
          id: p.options['printer-uri-supported'],
          name: p.name,
          ip: p.options['printer-uri-supported'],
          status: p.status,
          default: p.options['printer-uri-supported'] === 'ipp://localhost/printers/IMPRESSORA'
        }))
      } catch (error) {
        console.error('Erro ao listar impressoras:', error)
      }
    },
    async submitPrinters() {
      if (!this.selectedPrinter) {
        alert('Selecione uma impressora!')
        return
      }

      const printer = this.systemPrinters.find(
        (p) => p.id === this.selectedPrinter
      )
      if (!printer) {
        alert('Impressora não encontrada!')
        return
      }

      try {
        await axios.post(`${enviroments.API}/printer`, {
          ip: printer.ip,
          name: printer.name,
          system_driverinfo: printer.id
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        alert('Impressora selecionada com sucesso!')
      } catch (error) {
        console.error('Erro ao enviar a impressora:', error)
        alert('Erro ao selecionar a impressora.')
      }
    }
  }
})
</script>

<template>
  <v-container class="py-6 px-4" fluid>
    <h1 class="text-h5 text-center font-weight-medium mb-8">Seleção de Impressora</h1>
    <v-radio-group v-model="selectedPrinter" column class="max-width-800 mx-auto">
      <v-card
        v-for="systemPrinter in systemPrinters"
        :key="systemPrinter.id"
        class="mb-3 rounded-lg"
        variant="outlined"
        :class="{ 'selected-printer': selectedPrinter === systemPrinter.id }"
      >
        <v-row align="center" class="pa-4">
          <v-col cols="10">
            <div class="text-subtitle-1 font-weight-medium mb-1">
              {{ systemPrinter.name }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              <div class="d-flex align-center">
                <v-icon size="small" class="mr-1">mdi-printer-3d</v-icon>
                {{ systemPrinter.ip }}
              </div>
              <v-chip
                v-if="systemPrinter.default"
                size="small"
                color="primary"
                class="mt-2"
                variant="outlined"
              >
                Padrão
              </v-chip>
                            <v-chip
                v-if="selectedPrinter === systemPrinter.id"
                size="small"
                color="primary"
                class="mt-2"
                variant="outlined"
              >
                Selecionada
              </v-chip>
            </div>
          </v-col>
          <v-col cols="2" class="d-flex justify-center">
            <v-radio :value="systemPrinter.id" color="primary"></v-radio>
          </v-col>
        </v-row>
      </v-card>
    </v-radio-group>

    <div class="text-center mt-8">
      <v-btn
        color="primary"
        size="large"
        @click="submitPrinters"
        :disabled="!selectedPrinter"
        class="text-none px-8"
      >
        Confirmar Seleção
      </v-btn>
    </div>
  </v-container>
</template>

<style scoped>
.max-width-800 {
  max-width: 800px;
}

.selected-printer {
  border-color: rgb(var(--v-theme-primary)) !important;
  background-color: rgb(var(--v-theme-primary-lighten-5));
}

.text-medium-emphasis {
  color: rgba(0, 0, 0, 0.6);
}
</style>
