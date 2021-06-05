<template>
  <div id="app">
    <router-view v-if="loggedIn && user && !user.credentials.initial"/>
    <LoginView v-else/>
  </div>
</template>

<script>
import LoginView from "@/views/LoginView";
import {mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters(['loggedIn', 'user'])
  },
  components: {LoginView}
}
</script>
