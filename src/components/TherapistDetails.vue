<template>
  <div class="box" v-if="editedTherapist">
    <div class="is-size-5 block icon-text has-icons-left">
      <span class="icon">
        <icon icon="user"/>
      </span>
      <span>{{ editedTherapist.firstName }} {{ editedTherapist.lastName }} [{{editedTherapist.number}}]</span>
    </div>
    <div class="block">
      <validation-observer tag="form"
                           ref="formStatus"
                           v-slot="{invalid}"
                           @submit.prevent="submit"
                           @keydown.enter.prevent>
        <div class="field" v-show="!therapist.number">
          <validation-provider vid="number" name="Nummer" rules="required" v-slot="{errors}">
            <label for="numberEdit" class="label">
              Nummer
            </label>
            <div id="numberEdit" class="control">
              <input type="text" class="input" v-model="editedTherapist.number">
            </div>
            <p class="help is-danger">{{ errors[0] }}</p>
          </validation-provider>
        </div>
        <div class="is-flex">
          <div class="field is-flex-grow-1">
            <validation-provider vid="firstName" name="Vorname" v-slot="{errors}">
              <label for="firstNameEdit" class="label">
                Vorname
              </label>
              <div id="firstNameEdit" class="control">
                <input type="text" class="input" v-model="editedTherapist.firstName">
              </div>
              <p class="help is-danger">{{ errors[0] }}</p>
            </validation-provider>
          </div>
          <div class="field is-flex-grow-1 ml-2">
            <validation-provider vid="lastName" name="Nachname" rules="required" v-slot="{errors}">
              <label for="lastNameEdit" class="label">
                Nachname
              </label>
              <div id="lastNameEdit" class="control">
                <input type="text" class="input" v-model="editedTherapist.lastName">
              </div>
              <p class="help is-danger">{{ errors[0] }}</p>
            </validation-provider>
          </div>
        </div>
        <div class="field">
          <validation-provider vid="email" name="Email" v-slot="{errors}">
            <label for="emailEdit" class="label">
              Email
            </label>
            <div id="emailEdit" class="control">
              <input type="text" class="input" v-model="editedTherapist.email">
            </div>
            <p class="help is-danger">{{ errors[0] }}</p>
          </validation-provider>
        </div>
        <div class="field">
          <validation-provider vid="phone" name="Telefon" v-slot="{errors}">
            <label for="phoneEdit" class="label">
              Telefon
            </label>
            <div id="phoneEdit" class="control">
              <input type="text" class="input" v-model="editedTherapist.phone">
            </div>
            <p class="help is-danger">{{ errors[0] }}</p>
          </validation-provider>
        </div>
        <div class="field">
          <validation-provider vid="practice" name="Praxis" v-slot="{errors}">
            <label for="practiceEdit" class="label">
              Praxis
            </label>
            <div id="practiceEdit" class="control">
              <input type="text" class="input" v-model="editedTherapist.practice"
                     list="practiceDataList">
              <datalist id="practiceDataList">
                <option v-for="practice in practices" :key="'practice_' + practice"
                        :value="practice"/>
              </datalist>
            </div>
            <p class="help is-danger">{{ errors[0] }}</p>
          </validation-provider>
        </div>
        <div class="field has-text-right">
          <input type="submit"
                 class="button is-primary"
                 :disabled="invalid"
                 value="Speichern"/>
        </div>
      </validation-observer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    therapist: Object
  },
  data() {
    return {
      editedTherapist: Object.assign({}, this.therapist),
      practices: []
    }
  },
  methods: {
    submit() {
      let method = this.therapist.number ? 'post' : 'put'
      let pathVariable = this.therapist.number ? '/' + this.editedTherapist.number : ''
      this.$api[method]('/therapists' + pathVariable, this.editedTherapist).then(response => {
        this.$toast.info('Die Änderungen wurden gespeichert.')
        this.$emit('update', response.data)
      }).catch(error => {
        this.handleError(error)
        if (error.response && error.response.status === 400)
          this.$refs.formStatus.setErrors(error.response.data)
        else
          this.$toast.error('' + error.message)
      })
    },
    deactivateTherapist() {
      this.$api.delete(`/therapists/${this.editedTherapist.number}`).then(() => {
        this.$toast.info('Die Therapeutin wurde deaktiviert.')
        this.$emit('update')
      }).catch(error => this.$toast.error('' + error.message))
    }
  },
  watch: {
    therapist() {
      this.editedTherapist = Object.assign({}, this.therapist)
    }
  },
  mounted(){
    this.$api.get('/practices').then(result => this.practices = result.data)
  }
}
</script>