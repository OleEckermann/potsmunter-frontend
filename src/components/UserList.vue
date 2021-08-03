<template>
  <aside class="menu is-relative">
    <p class="menu-label">
      <slot>Therapeutinnen</slot>
    </p>
    <ul class="menu-list">
      <li v-for="user in users"
          :key="user.id">
        <a href="#"
           class="icon-text"
           :class="{'has-text-weight-bold': user === selectedUser}"
           @click="$emit('select', user)">
          <span class="icon">
            <icon icon="user"/>
          </span>
          <span>{{ user.name }}</span>
        </a>
      </li>
    </ul>
    </aside>
</template>

<script>
export default {
  props: {
    users: Array,
    selectedUser: Object
  }
}
</script>

<style scoped>
aside {
  position: relative;
  max-height: 50vh;
  overflow-y: scroll;
}
ul {
  position: relative;
  max-height: 100%;
}
</style>