<template>
  <aside class="menu">
    <p class="menu-label">Benutzer</p>
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