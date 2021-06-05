<template>
  <div class="columns is-centered">
    <div v-if="!loggedIn" class="column is-half">
      <login/>
    </div>
    <div v-if="loggedIn && user && user.credentials.initial" class="column is-half">
      <change-password/>
    </div>
  </div>
</template>
<script>
import Login from "@/components/Login";
import ChangePassword from "@/components/ChangePassword";
import {mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters(['loggedIn', 'user'])
  },
  components: {Login, ChangePassword}
}
</script>