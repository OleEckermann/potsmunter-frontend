<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img src="/favicon.ico" height="28">
      </a>

    </div>

    <div id="navbarBasicExample" class="navbar-menu is-active">
      <div class="navbar-start">
        <router-link v-slot="{navigate}"
                     :to="{name: 'treatmentAssignment'}"
                     custom>
          <a class="navbar-item is-tab"
             :class="{'is-active': $route.name === 'treatmentAssignment'}"
             @click="navigate">
            Behandlungen zuweisen
          </a>
        </router-link>
        <router-link v-slot="{navigate}"
                     :to="{name: 'reports'}"
                     custom>
          <a class="navbar-item is-tab"
             :class="{'is-active': $route.name === 'reports'}"
             @click="navigate">
            Berichte
          </a>
        </router-link>
        <router-link v-slot="{navigate}"
                     :to="{name: 'import'}"
                     custom>
          <a class="navbar-item is-tab"
             :class="{'is-active': $route.name === 'import'}"
             @click="navigate">
            Import
          </a>
        </router-link>
        <router-link v-slot="{navigate}"
                     :to="{name: 'therapists'}"
                     custom>
          <a class="navbar-item is-tab"
             :class="{'is-active': $route.name === 'therapists'}"
             @click="navigate">
            Therapeutinnen
          </a>
        </router-link>
        <router-link v-slot="{navigate}"
                     :to="{name: 'userManagement'}"
                     custom>
          <a class="navbar-item is-tab"
             :class="{'is-active': $route.name === 'userManagement'}"
             @click="navigate">
            Nutzerinnen
          </a>
        </router-link>

        <router-link v-slot="{navigate}"
                     :to="{name: 'ttoolsDatev'}"
                     custom>
          <a class="navbar-item is-tab"
             :class="{'is-active': $route.name === 'ttoolsDatev'}"
             @click="navigate">
            ttools2Datev
          </a>
        </router-link>

      </div>

      <div class="navbar-end">
        <div class="navbar-item" v-if="user">
          <div class="icon-text has-icons-right">
            <span>{{ user.name }}</span>
            <span class="icon is-link is-hoverable">
              <icon icon="power-off"
                    @click.prevent="performLogout"/>
            </span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapActions(['logout']),
    performLogout() {
      this.logout().then(() => this.showMessage({
        message: 'Sie wurden abgemeldet.',
        type: 'warning'
      }))
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/custom.scss";

nav {
  border-bottom: 1px solid $pink;
  padding: 0px 15px;
}
</style>