<template>
  <div class="block">
    <div class="title">Benutzerverwaltung</div>
    <div class="content">Nutzen Sie diesen Bildschirm, um neue Nutzer anzulegen, oder bestehende zu ändern.</div>
    <div class="columns block">
      <div class="column is-3">
        <user-list :users="users" :selectedUser="selectedUser" @select="selectUser($event)"/>
        <div class="block mt-3">
          <div class="button is-primary"
               @click="newUser">
            Neuer Nutzer
          </div>
        </div>
      </div>
      <div class="column" v-if="selectedUser">
        <user-details :user="selectedUser" @update="reloadList"/>
      </div>
      <div v-else class="column">
        <div class="content box">
          <span class="help is-info">Wählen Sie einen Nutzer aus der Liste, um ihn zu bearbeiten oder erstellen Sie einen neuen</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserList from "@/components/UserList";
import UserDetails from "@/components/UserDetails";

export default {
  data() {
    return {
      users: [],
      selectedUser: undefined
    }
  },
  methods: {
    selectUser(user) {
      this.selectedUser = user
    },
    newUser(){
      this.selectedUser = {
        name: '',
        credentials: {
          username: '',
          password: ''
        }
      }
    },
    reloadList() {
      this.selectedUser = undefined
      this.$api.get('/users').then(response => this.users = response.data)
    }
  },
  mounted() {
    this.reloadList()
  },
  components: {UserList, UserDetails}
}
</script>