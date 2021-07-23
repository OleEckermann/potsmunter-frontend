<template>
  <div id="app">
    <loading-overlay/>
    <navigation v-if="readyToUse"/>
    <div class="container" v-if="readyToUse">
      <router-view class="mt-5" v-if="readyToUse"/>
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
import LoadingOverlay from "@/components/LoadingOverlay";

export default {
  computed: {
    ...mapGetters(['readyToUse']),
  },
  components: {LoginView, Navigation, LoadingOverlay}
}
</script>
