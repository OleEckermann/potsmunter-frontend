<template>
  <div class="box">
    <div class="title">Anmelden</div>
    <form @submit.prevent="login(credentials)">
      <div class="field">
        <label for="usernameInput" class="label">Nutzername</label>
        <div class="control">
          <input id="usernameInput" class="input" type="text" v-model="credentials.username"
                 autocomplete="username"/>
        </div>
      </div>
      <div class="field">
        <label for="passwordInput" class="label">Passwort</label>
        <div class="control">
          <input id="passwordInput" class="input" type="password" v-model="credentials.password"
                 placeholder="mind. 16 beliebige Zeichen"
                 autocomplete="current-password"/>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <input class="button is-primary"
                 :class="{'is-loading': isLoading}"
                 type="submit" value="Anmelden"/>
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
        username: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapGetters(['isLoading'])
  },
  methods: {
    ...mapActions(['login'])
  }
}
</script>
