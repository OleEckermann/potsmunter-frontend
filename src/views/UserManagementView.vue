<template>
  <div class="block">
    <div class="title">Nutzerinnenverwaltung</div>
    <div class="content">Nutzen Sie diesen Bildschirm, um neue Nutzerinnen anzulegen, oder bestehende zu ändern.</div>
    <div class="columns block">
      <div class="column is-3">
        <user-list :users="users" :selectedUser="selectedUser" @select="selectUser($event)">
          Nutzer
        </user-list>
        <div class="block mt-3">
          <div class="button is-primary"
               @click="newUser">
            Neue Nutzerin
          </div>
        </div>
      </div>
      <div class="column" v-if="selectedUser">
        <user-details :user="selectedUser" @update="reloadList"/>
      </div>
      <div v-else class="column">
        <div class="content box">
          <span class="help is-info">Wählen Sie eine Nutzerin aus der Liste, um sie zu bearbeiten oder erstellen Sie eine neue</span>
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