<template>
  <div id="app">
    <navigation v-if="readyToUse"/>
    <div class="container">
      <router-view v-if="readyToUse"/>
      <LoginView v-else/>
    </div>
  </div>
</template>

<script>
import LoginView from "@/views/LoginView";
import Navigation from "@/components/Navigation"
import {mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters(['loggedIn', 'user']),
    readyToUse() {
      return this.loggedIn && this.user && this.user.credentials && !this.user.credentials.initial
    }
  },
  components: {LoginView, Navigation}
}
</script>
