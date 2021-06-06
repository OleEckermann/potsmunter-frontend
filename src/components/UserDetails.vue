<template>
  <div class="box" v-if="editedUser">
    <div class="is-size-5 block icon-text has-icons-left">
      <span class="icon">
        <icon icon="user"/>
      </span>
      <span>{{ editedUser.name }}</span>
    </div>
    <div class="block">
      <validation-observer tag="form"
                           ref="formStatus"
                           v-slot="{invalid}"
                           @submit.prevent="submit"
                           @keydown.enter.prevent>
        <div class="field">
          <validation-provider vid="username" name="Login" rules="required" v-slot="{errors}">
            <label for="usernameEdit" class="label">
              Login
            </label>
            <span class="help is-info">Wird zum Anmelden verwendet. Kann später nicht mehr verändert werden.</span>
            <div id="usernameEdit" class="control">
              <input type="text" class="input" v-model="editedUser.credentials.username"
                     :disabled="editedUser.id > 0">
            </div>
            <p class="help is-danger">{{ errors[0] }}</p>
          </validation-provider>
        </div>
        <div class="field">
          <validation-provider vid="password" name="Initialpasswort" :rules="'initialPassword' + (user.id > 0 ? '' : '|required')" v-slot="{errors}">
            <label for="passwordEdit" class="label">Initialpasswort</label>
            <span class="help is-info">Mindestens 5 Zeichen. Muss beim ersten oder nächsten Anmelden geändert werden. Der Nutzer muss über eine Änderung informiert werden. </span>
            <div id="passwordEdit" class="control">
              <input type="text" class="input" v-model="password"
              :placeholder="(user.id > 0 ? 'leer lassen, falls unverändert' : '')">
            </div>
            <p class="help is-danger">{{ errors[0] }}</p>
          </validation-provider>
        </div>
        <div class="field">
          <validation-provider vid="name" name="Name" rules="required" v-slot="{errors}">
            <label for="nameEdit" class="label">Name</label>
            <div id="nameEdit" class="control">
              <input type="text" class="input" v-model="editedUser.name">
            </div>
            <p class="help is-danger">{{ errors[0] }}</p>
          </validation-provider>
        </div>
        <div class="field has-text-right">
          <input type="submit"
                 class="button is-primary"
                 :disabled="invalid"
                 value="Speichern"/>
          <div class="button is-danger ml-2"
               @click="deleteUser">
            Nutzer löschen
          </div>
        </div>
      </validation-observer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: Object
  },
  data() {
    return {
      editedUser: Object.assign({}, this.user),
      password: undefined
    }
  },
  methods: {
    submit() {
      if (this.password)
        this.editedUser.credentials.password = this.password
      this.$api.post('/users', this.editedUser).then(response => {
        this.$toast.info('Die Änderungen wurden gespeichert.')
        this.$emit('update', response.data)
      }).catch(error => {
        if (error.response && error.response.status === 400)
          this.$refs.formStatus.setErrors(error.response.data)
        else
          this.$toast.error('' + error.message)
      })
    },
    deleteUser() {
      this.$api.delete(`/users/${this.editedUser.id}`).then(() => {
        this.$toast.info('Der Nutzer wurde gelöscht')
        this.$emit('update')
      }).catch(error => this.$toast.error('' + error.message))
    }
  },
  watch: {
    user() {
      this.editedUser = Object.assign({}, this.user)
    }
  }
}
</script>