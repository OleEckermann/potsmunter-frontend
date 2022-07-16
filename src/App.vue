<template>
  <div id="app">
    <loading-overlay/>
    <navigation/>
    <div class="container" >
      <router-view class="mt-5"/>
    </div>
    
  </div>
</template>

<script>
import Navigation from "@/components/Navigation"
import {mapGetters} from "vuex";
import LoadingOverlay from "@/components/LoadingOverlay";

export default {
  computed: {
    ...mapGetters(['readyToUse']),
  },
  components: {Navigation, LoadingOverlay}
}
</script>
