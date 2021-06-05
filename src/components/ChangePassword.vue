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
    <form @submit.prevent="changePassword(credentials)">
      <input type="text" hidden="true" id="username" name="username" autocomplete="username"
             :value="user.credentials.username"/>
      <div class="field">
        <label for="currentPasswordInput" class="label">Aktuelles Passwort</label>
        <div class="control">
          <input id="currentPasswordInput" class="input is-focused" type="password" v-model="credentials.currentPassword"
                 autocomplete="current-password"/>
        </div>
      </div>
      <div class="field">
        <label for="newPasswordInput" class="label">Neues Passwort</label>
        <div class="control">
          <input id="newPasswordInput" class="input" type="password" v-model="credentials.newPassword"
                 autocomplete="new-password"/>
        </div>
      </div>
      <div class="field">
        <label for="newPasswordRepeatInput" class="label">Neues Passwort wiederholen</label>
        <div class="control">
          <input id="newPasswordRepeatInput" class="input" type="password" v-model="credentials.newPasswordRepeat"
                 autocomplete="new-password"/>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <input class="button is-primary" type="submit" value="Passwort ändern"/>
        </div>
      </div>
    </form>
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
    ...mapActions(['changePassword'])
  }
}
</script>