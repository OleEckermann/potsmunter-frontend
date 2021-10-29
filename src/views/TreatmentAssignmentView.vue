<template>
  <div class="mb-5"
       @keydown.stop="checkShortcutPressed($event)">
    <div class="title">Behandlungen zuweisen</div>
    <div class="content">Weisen sie Behandlungen den entsprechenden TherapeutInnen zu</div>
    <div class="box is-flex is-flex-direction-row">
      <div class="is-flex-grow-2">
        <div class="tabs is-small mb-2">
          <ul>
            <li :class="{'is-active': searchByPrescription}" @click="searchBy('prescription')"><a>nach
              Verordnung/Patient</a>
            </li>
            <li :class="{'is-active': searchByDate}" @click="searchBy('date')"><a>nach Rechnungsdatum</a></li>
            <li :class="{'is-active': searchByImport}" @click="searchBy('import')"><a>nach Import</a></li>
          </ul>
        </div>
        <prescription-finder
            v-model="prescriptionQuery"
            v-show="searchByPrescription"
            class="mt-0"
            :include-ignored="includeIgnored"
            :include-processed="queryAlreadyProcessed"
            :focus="focusPrescriptionQuery"
            @focusout="focusPrescriptionQuery = false"/>
        <div v-if="searchByDate" class="is-flex">
          Rechnung im
          <month-selector v-model="date" class="ml-2"/>
        </div>
        <div v-if="searchByImport" class="is-flex">
          <imported-file-selector @input="selectedImportedFile = $event"/>
        </div>
      </div>
      <div class="is-flex is-flex-direction-column is-flex-grow-1 ml-4">
        <div class="field">
          <label class="label m-auto pl-2" for="allowProcessedInput">
            <input id="allowProcessedInput"
                   class="control checkbox"
                   type="checkbox"
                   v-model="queryAlreadyProcessed"
                   tabindex="-1"/>
            abgerechnete einbeziehen
          </label>
        </div>
        <div class="field">
          <label class="label m-auto pl-2" for="allowProcessedInput">
            <input id="includeIgnored"
                   class="control checkbox"
                   type="checkbox"
                   v-model="includeIgnored"
                   tabindex="-1"/>
            ignorierte einbeziehen
          </label>
        </div>
        <div class="field" v-if="searchByDate">
          <label class="label m-auto pl-2" for="allowProcessedInput">
            <input id="onlyUnassigned"
                   class="control checkbox"
                   type="checkbox"
                   v-model="onlyUnassigned"
                   tabindex="-1"/>
            nur nicht zugewiesene
          </label>
        </div>
      </div>
    </div>
    <div class="block" v-if="prescription">
      <div class="is-flex is-fullwidth">
        <div class="is-block is-flex-grow-1">
          <div class="heading">
            {{ prescription.patient }} / {{ prescription.number }} - {{ prescription.date | date }}
          </div>
          <div v-if="prescription.invoiceNumber" class="heading is-text is-italic">
            {{ prescription.invoiceNumber }} - {{ prescription.invoiceDate | date }}
            <icon class="has-text-danger" icon="trash-alt" @click="deleteInvoice(prescription.invoiceNumber)"/>
          </div>
        </div>
        <div v-if="(searchByDate || searchByImport) && prescription"
             class="is-flex is-flex-wrap-nowrap ml-2">
          <div class="is-text is-bold is-large" style="font-weight: bolder;">
            {{ prescription.number }}
          </div>
          <div class="ml-3">
            <a @click="navWorkList(-1)">
              <icon icon="chevron-left" class="mr-2 is-link"/>
            </a>
            {{ workListIndex + 1 }} von {{ workList.length }}
            <a @click="navWorkList(1)">
              <icon icon="chevron-right" class="ml-2 is-link"/>
            </a>
          </div>
        </div>
      </div>
      <div v-if="prescription.invoiceProcessed"
           class="has-text-warning icon-text has-icons-left">
        <icon icon="exclamation-triangle" class="icon mr-2"/>
        Diese Verordnung ist bereits abgerechnet.
        <button class="button is-small is-warning ml-3"
                @click="overruleInvoiceProcessed = true">
          dennoch bearbeiten
        </button>
      </div>
      <div v-if="prescription.ignored"
           class="has-text-warning icon-text has-icons-left">
        <icon icon="exclamation-triangle" class="icon mr-2"/>
        Diese Verordnung wird aktuell in Berichten ignoriert.
        <button class="button is-small is-warning ml-3"
                @click="ignorePrescription(false)">
          Ignorieren aufheben
        </button>
      </div>
    </div>
    <div v-else>
      Es wurden keine Verordnungen für diese Suchkriterien gefunden
    </div>
    <table class="table is-fullwidth"
           v-if="treatments.length > 0">
      <thead>
      <tr>
        <th>Nr.</th>
        <th>Datum</th>
        <th>Behandlungen</th>
        <th>TherapeutIn</th>
      </tr>
      </thead>
      <tfoot>
      <tr>
        <td colspan="2">
          <button class="button is-warning is-small"
                  tabindex="-1"
                  @click="disentanglePrescription"
                  :disabled="this.prescription.ignored">
            Vereinzeln
          </button>
          <div class="is-inline-flex has-text-info ml-1 mt-1 is-link"
               v-tooltip="'Diese Funktion hebt die Zusammenfassung von Behandlungen, die das gleiche Datum haben, auf.<br/>' +
                            'Dadurch können diese danach einzeln verschiedenen Therapeutinnen zugewiesen werden.<br/>' +
                            'Kann nicht rückgängig gemacht werden.<br/>' +
                            '<i>Tastaturkürzel: STRG+E</i>'">
            <icon icon="question-circle"/>
          </div>
        </td>
        <td colspan="2" class="has-text-right">
          <div class="buttons is-pulled-right">
            <button class="button is-warning"
                    tabindex="-1"
                    @click="ignorePrescription(true)"
                    :disabled="this.dirty || this.prescription.ignored">
              Diese Verordnung ignorieren
            </button>
            <button class="button is-danger"
                    :disabled="!dirty"
                    tabindex="-1"
                    @click="cancel">
              Abbrechen
            </button>
            <button class="button is-primary"
                    :disabled="!dirty"
                    @click="confirmSave">
              Speichern
            </button>
          </div>
        </td>
      </tr>
      </tfoot>
      <tbody>
      <tr v-for="(treatment, idx) in treatments" :key="treatment.id">
        <td>{{ treatment.number }}</td>
        <td>{{ treatment.date | date }}<span v-if="treatment.treatmentDateMissing || treatment.disentangled">*</span>
        </td>
        <td>
                <span v-for="(therapy, idx) in treatment.therapies"
                      :key="'therapy_' + idx"
                      :class="treatmentBlockClass(therapy.position)">
                  {{ therapy.position }} {{ therapy.name }}<br/>
                </span>
        </td>
        <td>
          <input :ref="'therapistInput_' + idx"
                 :id="treatment.id"
                 v-model="treatment.therapistQuery"
                 v-debounce:300ms.cancelonempty="therapistQueryUpdated"
                 debounce-events="input"
                 class="input"
                 type="text"
                 :list="'therapistDataList_' + treatment.id"
                 @input="handleTherapistInput(treatment, $event)"
                 @change="checkEmptyTherapistInput(treatment, $event)"
                 @keydown.stop="checkShortcutPressed($event, idx)"
                 :disabled="(prescription.invoiceProcessed && !overruleInvoiceProcessed) || prescription.ignored"
                 :placeholder="prescription.invoiceProcessed ? 'bereits abgerechnet' : prescription.ignored ? 'ignoriert' : ''"/>
          <datalist :id="'therapistDataList_' + treatment.id">
            <option v-for="therapist in treatment.therapistDataList" :key="treatment.id + '_' + therapist.number"
                    :value="'[' + therapist.number + '] ' + therapist.name"/>
          </datalist>
        </td>
      </tr>
      </tbody>
    </table>
    <div v-if="showDeliveryDateWarning">
      * Datum wurde manuell vereinzelt oder fehlte im Datensatz (Verordnungsdatum wird verwendet)
    </div>
    <vue-confirm-dialog></vue-confirm-dialog>
  </div>
</template>

<script>
import PrescriptionFinder from "@/components/PrescriptionFinder";
import MonthSelector from "@/components/MonthSelector";
import {mapActions} from "vuex";
import {DateTime} from "luxon";
import ImportedFileSelector from "@/components/ImportedFileSelector";

const therapistStr = (t) => '[' + t.number + '] ' + t.firstName + ' ' + t.lastName;
export default {
  components: {ImportedFileSelector, PrescriptionFinder, MonthSelector},
  data() {
    return {
      searchByPrescription: true,
      searchByDate: false,
      searchByImport: false,
      date: null,
      prescriptionQuery: '',
      selectedImportedFile: {id: -1},
      focusPrescriptionQuery: true,
      queryAlreadyProcessed: false,
      includeIgnored: false,
      onlyUnassigned: false,
      prescription: null,
      therapistQuery: '',
      therapistDataList: [],
      dirty: false,
      overruleInvoiceProcessed: false,
      workList: [],
      workListIndex: -1
    }
  },
  computed: {
    treatments() {
      return this.prescription ? this.prescription.treatments : []
    },
    showDeliveryDateWarning() {
      return this.prescription?.treatments.filter(t => t.treatmentDateMissing || t.disentangled).length > 0
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        if (to.query.m) {
          this.searchBy('date')
          this.$nextTick(() => {
            this.onlyUnassigned = true
            this.date = DateTime.local(+to.query.y, +to.query.m)
          })
        }
      }
    },
    searchByDate(turnedOn) {
      if (turnedOn) {
        this.date = DateTime.now()
      } else {
        this.prescriptionQueryUpdated()
      }
    },
    prescriptionQuery() {
      this.prescriptionQueryUpdated()
    },
    selectedImportedFile(newVal) {
      if (newVal)
        this.selectedImportedFileUpdated()
    },
    includeIgnored() {
      this.searchByDate ? this.dateUpdated() : this.prescriptionQueryUpdated()
    },
    queryAlreadyProcessed() {
      this.searchByDate ? this.dateUpdated() : this.prescriptionQueryUpdated()
    },
    onlyUnassigned() {
      if (this.searchByDate)
        this.dateUpdated()
    },
    date() {
      this.dateUpdated()
    },
    workList(){
      this.prescriptionQuery = this.workListIndex >= 0 ? this.workList[this.workListIndex] : ''
    },
    workListIndex() {
      this.prescriptionQuery = this.workListIndex >= 0 ? this.workList[this.workListIndex] : ''
    }
  },
  methods: {
    ...mapActions(['startLoading', 'stopLoading']),
    searchBy(searchType) {
      this.searchByDate = false
      this.searchByPrescription = false
      this.searchByImport = false
      if (searchType === 'date')
        this.searchByDate = true
      else if (searchType === 'import')
        this.searchByImport = true
      else if (searchType === 'prescription')
        this.searchByPrescription = true
    },
    dateUpdated() {
      this.startLoading('lade Verordnungsliste')
      this.$api.get(`/prescriptions`, {
        params: {
          y: this.date.year,
          m: this.date.month,
          p: this.queryAlreadyProcessed,
          i: this.includeIgnored,
          u: this.onlyUnassigned
        }
      }).then(response => {
        this.workList = response.data
        if (this.workList.length > 0)
          this.workListIndex = 0
        else {
          this.workListIndex = -1
        }
      }).catch(error => this.handleError(error))
          .finally(() => this.stopLoading())
    },
    prescriptionQueryUpdated() {
      if (this.prescriptionQuery)
        this.loadPrescription()
      else
        this.prescription = null
    },
    selectedImportedFileUpdated() {
      this.startLoading('lade Verordnungsliste')
      this.$api.get(`/prescriptions`, {
        params: {
          p: this.queryAlreadyProcessed,
          i: this.includeIgnored,
          u: this.onlyUnassigned,
          f: this.selectedImportedFile.id
        }
      }).then(response => {
        this.workList = response.data
        if (this.workList.length > 0)
          this.workListIndex = 0
        else {
          this.workListIndex = -1
        }
      }).catch(error => this.handleError(error))
          .finally(() => this.stopLoading())
    },
    navWorkList(step) {
      if (this.workListIndex + step < this.workList.length && this.workListIndex + step >= 0)
        this.workListIndex += step
    },
    loadPrescription() {
      const prescriptionNumber = this.prescriptionQuery.slice(1, this.prescriptionQuery.indexOf(']'))
      this.$api.get(`/prescriptions/${prescriptionNumber}`)
          .then(response => {
            this.prescriptionUpdated(response.data)
            this.$nextTick(() => {
              this.$refs['therapistInput_' + 0][0].focus()
              this.$refs['therapistInput_' + 0][0].select()
            })
          }).catch(error => this.handleError(error))
    },
    confirmSave() {
      let unassignedCount = this.prescription.treatments.filter(t => !t.therapist).length
      if (unassignedCount === 1) {
        this.$confirm({
          message: `Sie haben eine Behandlung nicht zugewiesen. Sind Sie sicher, dass dies so bleiben soll?`,
          button: {
            no: 'Nein',
            yes: 'Ja'
          },
          callback: confirm => {
            if (confirm)
              return this.savePrescription()
          }
        })
      } else {
        this.savePrescription()
      }
    },
    savePrescription(msg) {
      this.$api.put(`/prescriptions/${this.prescription.number}`, this.prescription)
          .then(response => {
            this.prescriptionUpdated(response.data)
            this.showSuccess('Die Änderungen wurden gespeichert')
            if (msg)
              this.showInfo(msg)
            this.goToNext()
          })
          .catch(error => this.handleError(error))
    },
    deleteInvoice(invoiceNumber) {
      this.$confirm({
        message: `Möchten Sie die Rechnung ` + invoiceNumber + ` mit all Ihren Verordnungen und Behandlungen komplett löschen?`,
        button: {
          no: 'Nein',
          yes: 'Ja'
        },
        callback: confirm => {
          if (confirm)
            this.$api.delete(`/invoices/${invoiceNumber}`)
                .then(() => {
                  this.showInfo('Die Rechnung ' + invoiceNumber + ' wurde gelöscht')
                  this.reset()
                }).catch(error => this.handleError(error))
        }
      })
    },
    goToNext() {
      this.$nextTick(() => {
        if (this.searchByPrescription)
          this.focusPrescriptionQuery = true
        else
          this.navWorkList(1)
      })
    },
    ignorePrescription(ignore) {
      if (!ignore) {
        this.prescription.ignored = false
        this.savePrescription('Die Verordnung wird nun nicht mehr ignoriert.')
      } else
        this.$api.delete(`/prescriptions/${this.prescription.number}`)
            .then(() => {
              this.prescription.ignored = true
              this.showInfo(`Die Verordnung ${this.prescription.number} wird in zukünftigen Suchen und Berichten ignoriert.`)
              this.goToNext()
            }).catch(error => this.handleError(error))
    },
    disentanglePrescription() {
      this.$api.put(`/prescriptions/${this.prescription.number}/disentangle`)
          .then(response => {
            this.prescriptionUpdated(response.data)
            this.showInfo('Die Behandlungen dieser Verordnungen können nun verschiedenen Therapeutinnen zugewiesen werden')
            this.$nextTick(() => {
              this.$refs['therapistInput_' + 0][0].focus()
              this.$refs['therapistInput_' + 0][0].select()
            })
          })
          .catch(error => this.handleError(error))
    },
    prescriptionUpdated(prescription) {
      prescription.treatments.forEach(t => {
        if (t.therapist) {
          t.therapistQuery = therapistStr(t.therapist)
        } else
          t.therapistQuery = ''
        t.therapistDataList = []
      })
      this.dirty = false
      this.prescription = prescription
    },
    therapistQueryUpdated(input, event) {
      let treatment = this.prescription.treatments.find(t => t.id === ~~event.target.id)
      if (treatment.therapistDataList.find(t => therapistStr(t) === treatment.therapistQuery)
          || treatment.therapistQuery.startsWith('['))
        treatment.therapistDataList = []
      else
        this.$api.get('/therapists', {
          params: {
            q: treatment.therapistQuery
          }
        }).then(response => {
          treatment.therapistDataList = response.data
        }).catch(error => this.handleError(error))
    },
    handleTherapistInput(treatment) {
      let therapist = treatment.therapistDataList.find(t => therapistStr(t) === treatment.therapistQuery);
      if (therapist) {
        const idx = this.treatments.indexOf(treatment);
        for (let i = idx; i < this.treatments.length; i++) {
          this.treatments[i].therapistQuery = treatment.therapistQuery
          this.treatments[i].therapist = therapist
        }
        this.dirty = true
        if (idx + 1 < this.treatments.length) {
          this.selectTherapistInput(idx + 1)
        }
      } else {
        treatment.therapist = undefined
      }
    },
    checkEmptyTherapistInput(treatment, event) {
      if (!event.target.value) {
        this.handleTherapistInput(treatment)
      }
    },
    checkShortcutPressed(e, inputFieldIdx) {
      if (e.key === "e" && (e.ctrlKey || e.metaKey) && this.prescription) {
        e.preventDefault()
        this.disentanglePrescription()
      } else if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        this.confirmSave()
      } else if (e.keyCode === 38) { // up
        if (inputFieldIdx > 0) {
          this.selectTherapistInput(inputFieldIdx - 1)
        }
      } else if (e.keyCode === 40) { // down
        if (inputFieldIdx < this.treatments.length - 1)
          this.selectTherapistInput(inputFieldIdx + 1)
      } else if (e.keyCode === 27) { // Escape
        this.cancel()
      }
    },
    selectTherapistInput(idx) {
      this.$nextTick(() => {
        let el = this.$refs['therapistInput_' + idx][0]
        el.focus()
        window.setTimeout(function () {
          el.select()
        }, 1)
      })
    },
    cancel() {
      this.loadPrescription()
    },
    reset() {
      if(this.searchByPrescription)
        this.prescriptionQuery = ''
      if(this.searchByImport)
        this.selectedImportedFileUpdated()
      if(this.searchByDate)
        this.dateUpdated()
    },
    treatmentBlockClass(position) {
      const block1 = [21302, 21303, 21310, 21312, 21501, 21517, 21530, 21531, 21532, 21533, 21534, 21703, 21705, 21708, 21710, 21712, 21714, 21720, 21732, 21733, 21801]
      const block2 = [21301, 29701, 29901, 29902, 29906, 29907, 29909, 29910, 29911, 29933, 29934, 29935, 21906]
      if (block1.indexOf(position) >= 0)
        return 'treatment-block-1'
      if (block2.indexOf(position) >= 0)
        return 'treatment-block-2'
      return ''
    }
  },
}
</script>

<style lang="scss" scoped>
@import "~@/assets/custom.scss";

.info-tt-wrapper {
  display: inline-flex;
}

.treatment-block-1 {
  color: $beige-light;
}

.treatment-block-2 {
  color: $cyan;
}
</style>
