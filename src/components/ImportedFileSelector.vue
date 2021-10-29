<template>
  <div class="select">
    <select @change="$emit('input', $event)">
      <option v-for="f in importedFiles"
              :key="'file_'+ f.id"
              :class="{'is-active': f.id === value.id}"
              :value="f">
        f.name
      </option>
    </select>
  </div>
</template>

<script>
export default {
  props: {
    value: Object
  },
  data() {
    return {
      importedFiles: []
    }
  },
  methods: {
    updateImportedFiles() {
      this.$api.get('/imports')
          .then(response => this.importedFiles = response.data)
          .catch(error => this.handleError(error))
    }
  },
  mounted() {
    this.updateImportedFiles()
  }
}
</script>
