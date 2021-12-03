<template>
  <div class="box">
    <div class="title">Anmelden</div>
    <validation-observer tag="form"
                         v-slot="{invalid}"
                         ref="formStatus"
                         @submit.prevent="submit"
                         @keydown.enter.prevent="submit">
      <div class="field">
        <validation-provider vid="username" name="Nutzername" rules="required" v-slot="{errors}">
          <label for="usernameInput" class="label">Nutzername</label>
          <div class="control">
            <input id="usernameInput" class="input" type="text" v-model="credentials.username"
                   autocomplete="username"/>
          </div>
          <p v-if="errors.length > 0" class="help is-danger">{{ errors[0] }}</p>
        </validation-provider>
      </div>
      <div class="field">
        <validation-provider vid="password" name="Password" rules="required" v-slot="{errors}">
          <label for="passwordInput" class="label">Passwort</label>
          <div class="control">
            <input id="passwordInput" class="input" type="password" v-model="credentials.password"
                   autocomplete="current-password"/>
          </div>
          <p v-if="errors.length > 0" class="help is-danger">{{ errors[0] }}</p>
        </validation-provider>
      </div>
      <div class="field">
        <validation-provider vid="general" v-slot="{errors}">
          <div class="control">
            <input class="button is-primary"
                   :class="{'is-loading': loading}"
                   :disabled="invalid"
                   type="submit" value="Anmelden"/>
          </div>
          <p v-if="errors.length > 0" class="help is-danger">{{ errors[0] }}</p>
        </validation-provider>
      </div>
    </validation-observer>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters(['loading'])
  },
  methods: {
    ...mapActions(['login']),
    submit() {
      this.login(this.credentials).catch(() => {
        this.$refs.formStatus.setErrors({
          password: 'Sie konnten nicht angemeldet werden. Bitte überprüfen Sie die Eingaben!'
        })
      })
    },
  }
}
</script>
