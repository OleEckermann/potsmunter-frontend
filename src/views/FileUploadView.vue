<template>
  <div class="mb-5">
    <div class="title">Datenimport</div>
    <div class="content">Importieren Sie Thera-Tools CSV-Exporte.</div>
    <div class="block box">
      <div class="field">
        <div class="file has-name is-fullwidth">
          <label class="file-label">
            <input
                ref="fileInput"
                class="file-input"
                type="file"
                name="resume"
                @change="fileSelected">
            <span class="file-cta">
              <span class="file-icon">
                <icon icon="upload"></icon>
              </span>
              <span class="file-label">
                CSV-Datei wählen
              </span>
            </span>
            <span class="file-name"
                  :class="{'has-text-warning': selectedFile.type && !isPotentiallyCSVFile}">
              {{ selectedFile.name }}
            </span>
          </label>
          <div v-if="selectedFile.type && !isPotentiallyCSVFile"
               class="ml-1 has-text-warning">
            Sind Sie sicher, dass das eine CSV-Datei ist?
          </div>
        </div>
      </div>
      <div class="field">
        <button
            class="button is-primary"
            @click="upload"
            :disabled="uploadStatus.processing || selectedFile.name === ''">
          <span class="icon-text">Verarbeiten</span>
          <icon class="icon fa-spin" icon="spinner" v-if="uploadStatus.processing"/>
        </button>
      </div>
    </div>
    <div class="block box"
         v-if="uploadStatus.show">
      <div class="heading">Verarbeitungsstatus Datei {{uploadStatus.filename}}</div>
      <div>Einträge insgesamt: {{ uploadStatus.totalEntries }}</div>
      <div>verarbeitet: {{ uploadStatus.entriesProcessed }}</div>
      <div class="box mt-2">
        <div class="has-text-info">{{ uploadStatus.currentEntry }}</div>
        <progress class="progress is-primary mb-1" :value="uploadStatus.entriesProcessed"
                  :max="uploadStatus.totalEntries">
        </progress>
        <div class="is-flex is-justify-content-space-between mr-5">
          <div class="is-inline-flex has-text-success">OK: {{ uploadStatus.validEntries }}</div>
          <div class="is-inline-flex has-text-warning">Duplikate: {{ uploadStatus.duplicateEntries }}</div>
          <div class="is-inline-flex has-text-info">Zuzahlungsr.: {{ uploadStatus.skippedEntries }}</div>
          <div class="is-inline-flex has-text-danger">Fehler: {{ uploadStatus.errorEntries }}</div>
        </div>
      </div>
      <div class="buttons">
        <div class="button is-primary" v-if="!uploadStatus.processing" @click="finishProcessing">OK</div>
        <div class="button is-warning" v-if="uploadStatus.processing" @click="stopProcessing">Abbrechen</div>
      </div>
    </div>
  </div>
</template>

<script>
const CSV_TYPES = [
  'text/plain',
  'application/vnd.ms-excel',
  'text/x-csv',
  'application/csv',
  'application/x-csv',
  'text/csv',
  'text/comma-separated-values',
  'text/x-comma-separated-values',
  'text/tab-separated-values'
]
export default {
  data() {
    return {
      selectedFile: {name: ''},
      uploadStatus: undefined
    }
  },
  computed: {
    isPotentiallyCSVFile() {
      return CSV_TYPES.includes(this.selectedFile?.type)
    }
  },
  methods: {
    resetUploadStatus() {
      this.uploadStatus = {
        filename: null,
        show: false,
        processing: false,
        currentEntry: '',
        totalEntries: 0,
        entriesProcessed: 0,
        validEntries: 0,
        errorEntries: 0,
        duplicateEntries: 0,
        skippedEntries: 0
      }
    },
    fileSelected() {
      this.selectedFile = this.$refs.fileInput.files[0]
      console.log(this.selectedFile?.type)
    },
    async upload() {
      // Credit: https://stackoverflow.com/a/754398/52160
      let reader = new FileReader();
      reader.readAsText(this.selectedFile, 'ISO-8859-1');
      reader.onload = async evt => {
        this.resetUploadStatus()
        this.uploadStatus.filename = this.selectedFile.name
        this.uploadStatus.show = true
        this.uploadStatus.processing = true
        try {
          let text = evt.target.result;
          let lines = text.split('\n');
          this.uploadStatus.totalEntries = lines.length - 2
          const header = lines[0]
          let prescriptions = new Map()
          for (let row = 1; row < lines.length; row++) {
            let entry = lines[row]
            let prescriptionNumber = entry.split(';')[8]
            if (prescriptionNumber && prescriptionNumber !== '') {
              if (!prescriptions.has(prescriptionNumber)) {
                prescriptions.set(prescriptionNumber, '')
              }
              prescriptions.set(prescriptionNumber, prescriptions.get(prescriptionNumber) + entry + '\n')
            }
          }
          for (const [prescriptionNumber, csv] of prescriptions) {
            if (!this.uploadStatus.processing)
              break
            this.uploadStatus.currentEntry = '...' + csv.slice(46, 46 + Math.min(csv.length - 46, 80)) + '...'
            await this.$api.post('/import', {
              prescriptionNumber: prescriptionNumber,
              treatmentsCSV: header + '\n' + csv
            }).then(response => {
              const results = response.data
              this.uploadStatus.entriesProcessed += results.length
              for (const result of results) {
                if (result === 'consumed')
                  this.uploadStatus.validEntries++
                if (result === 'ignored')
                  this.uploadStatus.skippedEntries++
                if (result === 'duplicate')
                  this.uploadStatus.duplicateEntries++
                if (result === 'invalid')
                  this.uploadStatus.errorEntries++
              }
            }).catch(error => {
              console.log(error)
              this.uploadStatus.errorEntries++
              // this.handleError(error)
            })
          }
        } finally {
          this.stopProcessing()
          this.clearFileInput()
        }
      }
      reader.onerror = evt => {
        console.error(evt);
        this.stopProcessing()
      }
    },
    stopProcessing() {
      this.uploadStatus.processing = false
    },
    finishProcessing() {
      this.clearFileInput();
      this.uploadStatus.show = false
    },
    clearFileInput() {
      this.$refs['fileInput'].value = null
      this.selectedFile = {name: ''}
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.uploadStatus.processing) {
      this.showMessage({
        message: 'Beenden oder unterbrechen Sie zunächst den Datenimport, bevor Sie diese Seite verlassen.',
        type: 'warning'
      })
      return false
    }
    return next()
  },
  beforeMount() {
    this.resetUploadStatus()
  }
}
</script>
