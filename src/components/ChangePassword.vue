<template>
  <div class="box" v-if="user">
    <div class="title">Passwort ändern</div>
    <div class="content">
      <div class="block">
        Sie müssen bei der ersten Anmeldung Ihr Passwort ändern.
        Das Passwort muss keine besonderen Bedingungen erfüllen, aber <span class="has-text-weight-bold">mindestens 15 Zeichen</span>
        haben.
        Wählen Sie etwas, das Sie sich leicht merken können wie z.B.
        <li>'Ich mag Apfelkuchen'</li>
        <li>'Born in Brandenburg'</li>
        <li>'Und es war Sommer'</li>
      </div>
    </div>
    <validation-observer tag="form"
                         v-slot="{invalid}"
                         ref="formStatus"
                         @submit.prevent="submit"
                         @keydown.enter.prevent>
      <input type="text" hidden="true" id="username" name="username" autocomplete="username"
             :value="user.credentials.username"/>
      <div class="field">
        <validation-provider vid="currentPassword" name="Passwort" rules="required" v-slot="{errors}">
          <label for="currentPasswordInput" class="label">Aktuelles Passwort</label>
          <div class="control">
            <input id="currentPasswordInput"
                   class="input"
                   :class="{'is-danger': errors.length > 0}"
                   type="password"
                   v-model="credentials .currentPassword"
                   autofocus
                   autocomplete="current-password"/>
          </div>
          <p v-if="errors.length > 0" class="help is-danger">{{ errors[0] }}</p>
        </validation-provider>
      </div>
      <div class="field">
        <validation-provider vid="newPassword" name="Neues Passwort" rules="required" v-slot="{errors}">
          <label for="newPasswordInput" class="label">Neues Passwort</label>
          <div class="control">
            <input id="newPasswordInput"
                   class="input"
                   :class="{'is-danger': errors.length > 0}"
                   type="password"
                   v-model="credentials.newPassword"
                   autocomplete="new-password"/>
          </div>
          <p v-if="errors.length > 0" class="help is-danger">{{ errors[0] }}</p>
        </validation-provider>
      </div>
      <div class="field">
        <validation-provider vid="newPasswordRepeat"
                             name="Passwort-Wiederholung"
                             rules="required|password:@newPassword"
                             v-slot="{errors}">
          <label for="newPasswordRepeatInput" class="label">Neues Passwort wiederholen</label>
          <div class="control">
            <input id="newPasswordRepeatInput" class="input" type="password" v-model="credentials.newPasswordRepeat"
                   autocomplete="new-password"/>
          </div>
          <p v-if="errors.length > 0" class="help is-danger">{{ errors[0] }}</p>
        </validation-provider>
      </div>
      <div class="field">
        <div class="control">
          <input class="button is-primary"
                 :class="{disabled: invalid}"
                 :disabled="invalid"
                 type="submit"
                 value="Passwort ändern"/>
        </div>
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
        newPassword: '',
        newPasswordRepeat: '',
        currentPassword: ''
      }
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  methods: {
    ...mapActions(['changePassword']),
    submit() {
      this.changePassword(this.credentials).catch(error => {
        this.$refs.formStatus.setErrors(error.response.data)
      })
    }
  }
}
</script>