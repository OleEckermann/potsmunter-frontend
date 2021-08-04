<template>
  <div class="mb-5">
    <div class="title">Behandlungen zuweisen</div>
    <div class="content">Weisen sie Behandlungen den entsprechenden TherapeutInnen zu</div>
    <form @submit.prevent="handlePrescriptionInput">
      <div class="is-flex">
        <div class="field is-grouped is-flex-grow-1">
          <label class="label"
                 for="prescriptionInput">
            Verordnung
          </label>
          <input v-model="prescriptionQuery"
                 v-debounce:300ms="prescriptionQueryUpdated"
                 class="input ml-2"
                 type="text"
                 list="prescriptions"
                 id="prescriptionInput"
                 ref="prescriptionInput"
                 @input="handlePrescriptionInput"
                 autofocus/>
          <datalist id="prescriptions">
            <option v-for="entry in prescriptionDataList" :key="entry" :value="entry"/>
          </datalist>
        </div>
        <div class="field is-flex-grow-4 is-flex is-align-content-center">
          <label class="label ml-2" for="allowProcessedInput">
            <input id="allowProcessedInput"
                   class="control checkbox"
                   type="checkbox"
                   v-model="queryAlreadyProcessed"/>
            abgerechnete einbeziehen
          </label>
        </div>
      </div>
    </form>
    <div class="block" v-if="prescription">
      {{ prescription.patient }} / {{ prescription.date | date }}
      <div v-if="prescription.invoiceProcessed"
           class="has-text-warning icon-text has-icons-left">
        <icon icon="exclamation-triangle" class="icon mr-2"/>
        Diese Verordnung ist bereits abgerechnet.
        <button class="button is-small is-warning ml-3"
                @click="overruleInvoiceProcessed = true">
          dennoch bearbeiten
        </button>
      </div>
    </div>
    <div class="block" v-if="treatments.length > 0">
      <table class="table is-bordered is-fullwidth">
        <tr>
          <th>Datum</th>
          <th>Behandlungen</th>
          <th>TherapeutIn</th>
        </tr>
        <tr v-for="(treatment, idx) in treatments" :key="treatment.id">
          <td>{{ treatment.date | date }}<span v-if="treatment.treatmentDateMissing">*</span></td>
          <td>
            <span v-for="(therapy, idx) in treatment.therapies"
                  :key="'therapy_' + idx">
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
                   @keydown.stop="checkShortcutPressed($event, idx)"
                   :disabled="prescription.invoiceProcessed && !overruleInvoiceProcessed"
                   :placeholder="prescription.invoiceProcessed ? 'bereits abgerechnet' : ''"/>
            <datalist :id="'therapistDataList_' + treatment.id">
              <option v-for="therapist in treatment.therapistDataList" :key="treatment.id + '_' + therapist.number"
                      :value="'[' + therapist.number + '] ' + therapist.name"/>
            </datalist>
          </td>
        </tr>
        <tr>
          <td colspan="3" class="has-text-right">
            <div class="buttons is-pulled-right">
              <button class="button is-danger"
                      :disabled="!dirty"
                      tabindex="-1"
                      @click="cancel">
                Abbrechen
              </button>
              <button class="button is-primary"
                      :disabled="!dirty"
                      @click="savePrescription">
                Speichern
              </button>
            </div>
          </td>
        </tr>
      </table>
      <div v-if="showDeliveryDateWarning">
        * Datum fehlte im Datensatz (Verordnungsdatum wird verwendet)
      </div>
    </div>
  </div>
</template>

<script>
const therapistStr = (t) => '[' + t.number + '] ' + t.firstName + ' ' + t.lastName;
export default {
  data() {
    return {
      prescriptionQuery: '',
      queryAlreadyProcessed: false,
      prescriptionDataList: [],
      prescription: null,
      therapistQuery: '',
      therapistDataList: [],
      dirty: false,
      overruleInvoiceProcessed: false
    }
  },
  computed: {
    treatments() {
      return this.prescription ? this.prescription.treatments : []
    },
    showDeliveryDateWarning() {
      return this.prescription.treatments.filter(t => t.treatmentDateMissing).length > 0
    }
  },
  watch: {
    queryAlreadyProcessed() {
      this.prescriptionQueryUpdated()
    }
  },
  methods: {
    prescriptionQueryUpdated() {
      if (this.prescriptionDataList.indexOf(this.prescriptionQuery) >= 0)
        this.prescriptionDataList = []
      else
        this.$api.get('/prescriptions', {
          params: {
            q: this.prescriptionQuery,
            p: this.queryAlreadyProcessed
          }
        }).then(response => {
          this.prescriptionDataList = response.data
        }).catch(error => this.handleError(error))
    },
    handlePrescriptionInput() {
      if (this.prescriptionDataList.indexOf(this.prescriptionQuery) >= 0)
        this.loadPrescription()
    },
    loadPrescription() {
      this.$api.get(`/prescriptions/${this.prescriptionQuery}`)
          .then(response => {
            this.prescriptionUpdated(response.data)
            this.$nextTick(() => {
              this.$refs['therapistInput_' + 0][0].focus()
              this.$refs['therapistInput_' + 0][0].select()
            })
          }).catch(error => this.handleError(error))
    },
    savePrescription() {
      this.$api.post('/prescriptions', this.prescription)
          .then(response => {
            this.prescriptionUpdated(response.data)
            this.showInfo('Die Änderungen wurden gespeichert')
            this.$refs.prescriptionInput.focus()
            this.$refs.prescriptionInput.select()
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
      this.prescription = prescription
      this.dirty = false
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
      }
    },
    checkShortcutPressed(e, inputFieldIdx) {
      if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.savePrescription()
      } else if (e.keyCode === 38) {
        if (inputFieldIdx > 0) {
          this.selectTherapistInput(inputFieldIdx - 1)
        }
      } else if (e.keyCode === 40) {
        if (inputFieldIdx < this.treatments.length - 1)
          this.selectTherapistInput(inputFieldIdx + 1)
      } else if (e.keyCode === 27) {
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
    }
  }
}
</script>