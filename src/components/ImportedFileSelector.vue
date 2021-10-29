<template>
  <div class="select">
    <select v-model="selected">
      <option v-for="f in importedFiles"
              :key="'file_'+ f.id"
              :class="{'is-active': f.id === selected.id}"
              :value="f">
        <div>
          {{ f.date | date }} &quot;{{ f.name }}&quot; - {{ f.importedBy }}
        </div>
      </option>
    </select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      importedFiles: [],
      selected: {}
    }
  },
  watch: {
    selected() {
      this.$emit('input', this.selected)
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
