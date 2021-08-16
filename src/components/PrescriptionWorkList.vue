<template>
  <div>
    noch {{items.length}} Verordnungen zu bearbeiten
  </div>
</template>

<script>
export default {
  props: {
    items: Array,
    currentItem: Object
  }
}
</script>