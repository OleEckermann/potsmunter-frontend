<template>
  <form @submit.prevent="handlePrescriptionInput">
    <div class="is-flex">
      <div class="field is-grouped is-flex-grow-1">
        <label class="label m-auto"
               for="prescriptionInput">
          Verordnung
        </label>
        <input v-model="query"
               v-debounce:300ms="prescriptionQueryUpdated"
               class="input ml-2"
               type="text"
               list="prescriptions"
               id="prescriptionInput"
               ref="prescriptionInput"
               @input="handlePrescriptionInput"
               @focusout="$emit('focusout')"
               autofocus/>
        <datalist id="prescriptions">
          <option v-for="entry in dataList" :key="entry.id" :value="getSearchResultFormat(entry)"/>
        </datalist>
      </div>
    </div>
  </form>
</template>

<script>
import {isAlphaNum} from "@/utils/url-utils";

export default {
  props: {
    includeIgnored: {
      type: Boolean,
      default: false
    },
    includeProcessed: {
      type: Boolean,
      default: false
    },
    focus: Boolean,
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      query: '',
      dataList: []
    }
  },
  computed: {
    duplicateNumbers(){
      const alreadyParsed = []
      const res = []
      for(let number of this.dataList.map(e => e.number)){
        if(alreadyParsed.indexOf(number) >= 0){
          res.push(number)
        } else {
          alreadyParsed.push(number)
        }
      }
      return res
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        this.query = newVal
        this.prescriptionQueryUpdated()
      }
    },
    focus(newVal) {
      if (newVal) {
        this.$refs['prescriptionInput'].focus()
        this.$refs['prescriptionInput'].select()
      }
    }
  },
  methods: {
    prescriptionQueryUpdated() {
      if (this.dataList.indexOf(this.query) >= 0
          || !isAlphaNum(this.query))
        this.dataList = []
      else
        this.$api.get('/prescriptions', {
          params: {
            q: this.query,
            p: this.includeProcessed,
            i: this.includeIgnored
          }
        }).then(response => {
          this.dataList = response.data
        }).catch(error => this.handleError(error))
    },
    handlePrescriptionInput() {
      const matchingEntryIdx = this.dataList
          .map(entry => this.getSearchResultFormat(entry))
          .indexOf(this.query)
      if (matchingEntryIdx >= 0){
        this.$emit('input', this.getSearchResultFormat(this.dataList[matchingEntryIdx]))
        this.$emit('entryChanged', this.dataList[matchingEntryIdx])
      }
    },
    isDuplicate(entry){
      return this.duplicateNumbers.indexOf(entry.number) >= 0
    },
    getSearchResultFormat(entry) {
      return '[' + entry.number + '] ' + entry.patient + (this.isDuplicate(entry) ? ' (' + entry.invoiceNumber + ')': '')
    }
  },

}
</script>
