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
          <option v-for="entry in dataList" :key="entry" :value="entry"/>
        </datalist>
      </div>
    </div>
  </form>
</template>

<script>
import {isAlphaNum} from "@/utils/url-utils";

export default {
  props: {
    includeIgnored: Boolean,
    includeProcessed: Boolean,
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
  watch: {
    value: {
      immediate: true,
      handler(newVal){
        this.query = newVal
        this.prescriptionQueryUpdated()
      }
    },
    focus(newVal){
      if(newVal) {
        this.$refs['prescriptionInput'].focus()
        this.$refs['prescriptionInput'].select()
      }
    }
  },
  methods: {
    prescriptionQueryUpdated() {
      if (this.dataList.indexOf(this.query) >= 0
          || !isAlphaNum(this.query))
        this.prescriptionDataList = []
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
      if (this.dataList.indexOf(this.query) >= 0)
        this.$emit('input', this.query)
    },
  },

}
</script>