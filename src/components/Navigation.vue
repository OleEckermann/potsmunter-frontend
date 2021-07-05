<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img src="/favicon.ico" height="28">
      </a>

      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <div class="navbar-item has-dropdown is-hoverable">
          <router-link v-slot="{navigate}"
                       :to="{name: 'treatmentAssignment'}"
                       custom>
            <a class="navbar-item is-tab"
               :class="{'is-active': $route.name === 'treatmentAssignment'}"
               @click="navigate">
              Verordnungen
            </a>
          </router-link>

          <div class="navbar-dropdown">
            <router-link v-slot="{navigate}"
                         :to="{name: 'treatmentAssignment'}"
                         custom>
              <a class="navbar-item"
                 :class="{'is-active': $route.name === 'treatmentAssignment'}"
                 @click="navigate">
                Behandlungen zuweisen
              </a>
            </router-link>
            <a class="navbar-item">
              Unbearbeitete Verordnungen anzeigen
            </a>
          </div>
        </div>
        <router-link v-slot="{navigate}"
                     :to="{name: 'userManagement'}"
                     custom>
          <a class="navbar-item is-tab"
             :class="{'is-active': $route.name === 'userManagement'}"
             @click="navigate">
            Benutzerverwaltung
          </a>
        </router-link>

      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-primary">
              <strong>Sign up</strong>
            </a>
            <a class="button is-light">
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@import "@/assets/custom.scss";

nav {
  border-bottom: 1px solid $pink;
  padding: 0px 15px;
}
</style>