<template>
  <div id="app">
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

export default {
  computed: {
    ...mapGetters(['readyToUse']),
  },
  components: {LoginView, Navigation}
}
</script>
