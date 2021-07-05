<template>
  <div id="app">
    <div class="container" v-if="readyToUse">
      <navigation v-if="readyToUse"/>
      <router-view v-if="readyToUse"/>
    </div>
    <div class="container" v-else>
      <LoginView/>
    </div>
  </div>
</template>

<script>
import LoginView from "@/views/LoginView";
import Navigation from "@/components/Navigation"
import {mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters(['readyToUse']),
  },
  components: {LoginView, Navigation}
}
</script>
