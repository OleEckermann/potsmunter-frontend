<template>
  <div class="mb-5">
    <div class="title">Berichte</div>
    <div class="content">Erstellen und verschicken Sie Zahlungsberichte</div>
    <div class="block">
      <span class="icon button" @click="navigate(-1)"><icon icon="chevron-left"></icon></span>
      {{ date.toFormat('MMM') }}&nbsp;{{ date.toFormat('yy') }}
      <span class="icon button" @click="navigate(1)"><icon icon="chevron-right"></icon></span>
    </div>
    <div class="block">
      <div v-if="noLogsAvailable">Es liegen zu diesem Monat noch keine Informationen zu Berichten vor.</div>
    </div>
    <form>
      <div class="field">
        <label for="therapistSelector">Report ansehen für</label>
        <div class="control">
          <input v-model="therapistQuery"
                 class="input"
                 type="text"
                 list="therapistList"
                 id="therapistSelector"
                 v-debounce:300ms="therapistQueryUpdated"
                 @input="handleTherapistInput"
                 autofocus/>
          <datalist id="therapistList">
            <option v-for="therapist in therapists" :key="therapist.number" :value="therapist.name"/>
          </datalist>
        </div>
      </div>
    </form>
    <div class="box report-box">
    </div>
  </div>
</template>

<script>
import {DateTime} from "luxon";

const therapistStr = (t) => '[' + t.number + '] ' + t.firstName + ' ' + t.lastName;
export default {
  data() {
    return {
      date: DateTime.now().setLocale('de'),
      reportInfo: {},
      therapistQuery: '',
      therapists: []
    }
  },
  computed: {
    noLogsAvailable() {
      return this.reportInfo?.logs?.length === 0
    }
  },
  watch: {
    date() {
      this.$api.get(`/reports/${this.date.year}/${this.date.month}`)
          .then(response => this.reportInfo = response.data)
          .catch(error => this.handleError(error))
    }
  },
  methods: {
    navigate(n) {
      this.date = this.date.plus({month: n})
    },
    therapistQueryUpdated() {
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
        this.$api.get(`/reports/${this.year}/${this.month}/${therapist.number}`)
            .then(response => {
              this.reportHtml = response.data.html
            })
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