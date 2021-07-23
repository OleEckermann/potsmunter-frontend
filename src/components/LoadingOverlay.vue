<template>
  <div class="overlay"
       v-if="loading">
    <div class="content icon-text has-text-centered">
      {{loadingMessage}}
      <icon icon="spinner" class="fa-spin"/>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters(['loading', 'loadingMessage'])
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  z-index: 9999;
  display: table;
  top: 0;
  left: 0;
  table-layout: fixed;
  height: 100vh;
  width: 100vw;
  background-color: #FFF7;
  color: #FE2055;
}

.content {
  font-size: larger;
  display: table-cell;
  vertical-align: middle;
}
</style>