<template>
  <div class="mb-5">
    <div class="title">Berichte</div>
    <div class="content">Erstellen und verschicken Sie Zahlungsberichte</div>
    <div class="block">
      <span class="icon button" @click="navigate(-1)"><icon icon="chevron-left"></icon></span>
      {{ date.toFormat('MMMM') }}&nbsp;{{ date.toFormat('yy') }}
      <span class="icon button" @click="navigate(1)"><icon icon="chevron-right"></icon></span>
    </div>
    <div class="block box" v-if="reportInfo">
      <div v-if="reportInfo.incompleteInvoiceCount > 0"
           class="icon-text">
        <icon class="icon has-text-danger" size="2x" icon="times-circle"/>
        <span class="is-bold has-text-danger is-clickable">
          {{ reportInfo.incompleteInvoiceCount }}
        </span>
        &nbsp;von {{ reportInfo.invoiceCount }} Rechnung<span v-if="reportInfo.invoiceCount > 1">en</span>&nbsp;
        {{ reportInfo.incompleteInvoiceCount === 1 ? 'hat' : 'haben' }} noch nicht ignorierte Verordnungen mit nicht
        zugeordneten Behandlungen.
      </div>
      <div v-else
           class="icon-text">
        <icon class="icon has-text-success" size="2x" icon="check-circle"/>
        Alle&nbsp;
        <span class="is-bold has-text-success">{{ reportInfo.invoiceCount }}</span>
        &nbsp;Behandlungen der Verordnungen in diesem Abrechnungszeitraum sind Therapeutinnen zugewiesen.
      </div>
      <div class="buttons mt-5">
        <router-link v-if="reportInfo.incompleteInvoiceCount > 0"
                     v-slot="{navigate}"
                     :to="{name: 'treatmentAssignment', query: {m: date.month, y:date.year}}"
                     custom>
          <div class="button is-info"
               @click="navigate">
            Bearbeiten
          </div>
        </router-link>
        <div class="button is-warning"
             v-if="reportInfo.incompleteInvoiceCount > 0"
             @click="downloadReport(null)"
             target="_parent">
          Ignorieren und alle Berichte erstellen
        </div>
        <div class="button is-primary"
             v-if="reportInfo.incompleteInvoiceCount === 0"
             @click="downloadReport(null)">
          alle Berichte erstellen
        </div>
      </div>
      <div class="buttons">
        <div class="field">
          <label for="therapistSelector">Nur für diese Therapeutin</label>
          <div class="control is-flex is-grouped">
            <input v-model="therapistQuery"
                   class="input"
                   type="text"
                   list="therapistList"
                   id="therapistSelector"
                   v-debounce:300ms="therapistQueryUpdated"
                   @input="handleTherapistInput"
                   autofocus/>
            <datalist id="therapistList">
              <option v-for="therapist in therapistsList" :key="therapist" :value="therapist"/>
            </datalist>
            <button class="button is-primary ml-2"
                    :disabled="!selectedTherapist"
                    @click="downloadReport(selectedTherapist.number)">
              Bericht erstellen
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="heading">Berichts-Audit</div>
    <div class="table-container">
      <div v-if="noLogsAvailable">Es liegen zu diesem Monat noch keine Informationen zu Berichten vor.</div>
      <div v-else>
        <table class="table">
          <tr v-for="log in reportInfo.logs" :key="'log_'+log.id">
            <td>{{ log.createdDate|dateTime }}</td>
            <td>{{ log.userName }}</td>
            <td>{{ log.comment }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {DateTime} from "luxon";
import {mapActions} from "vuex";
import {isAlphaNum} from "@/utils/url-utils";

const therapistStr = (t) => '[' + t.number + '] ' + t.firstName + ' ' + t.lastName;
export default {
  data() {
    return {
      date: DateTime.now().setLocale('de'),
      reportInfo: {},
      therapistQuery: '',
      selectedTherapist: undefined,
      therapists: [],
    }
  },
  computed: {
    year() {
      return this.date.year
    },
    month() {
      return this.date.month
    },
    noLogsAvailable() {
      return this.reportInfo?.logs?.length === 0
    },
    therapistsList() {
      return this.therapists.map(t => therapistStr(t))
    }
  },
  watch: {
    date: {
      immediate: true,
      handler: function () {
        this.loadReportInfo()
      }
    }
  },
  methods: {
    ...mapActions(['startLoading', 'stopLoading']),
    loadReportInfo() {
      this.$api.get(`/reports/${this.date.year}/${this.date.month}`)
          .then(response => this.reportInfo = response.data)
          .catch(error => this.handleError(error))
    },
    navigate(n) {
      this.date = this.date.plus({month: n})
    },
    downloadReport(therapistNumber) {
      this.startLoading('Berichte werden generiert')
      const paramArr = therapistNumber ? [therapistNumber] : []
      this.$api.post(`/reports/${this.year}/${this.month}`, paramArr, {
        responseType: 'blob'
      }).then(response => {
        console.log(response)
        let blob
        try {
          blob = new Blob([response.data], {type: 'application/zip'})
        } catch (e) {
          let BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
              window.MozBlobBuilder || window.MSBlobBuilder
          let builder = new BlobBuilder()
          builder.append(response.data)
          blob = builder.getBlob('application/zip');
        }
        let blobURL = window.webkitURL.createObjectURL(blob)
        window.open(blobURL)
      })
          .catch(error => this.handleError(error))
          .finally(() => this.stopLoading())
          .then(() => {
            this.loadReportInfo()
          })
    },
    therapistQueryUpdated() {
      if (this.therapistsList.indexOf(this.therapistQuery) >= 0
          || !isAlphaNum(this.therapistQuery))
        return
      this.$api.get('/therapists', {
        params: {
          q: this.therapistQuery
        }
      }).then(response => {
        this.therapists = response.data
      })
    },
    handleTherapistInput() {
      let therapist = this.therapists.find(t => therapistStr(t) === this.therapistQuery);
      if (therapist) {
        this.selectedTherapist = therapist
      }
    }
  }
}
</script>
<style>
.report-box {
  max-height: 600px;
  overflow-y: auto;
}
</style>
