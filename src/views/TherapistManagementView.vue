<template>
  <div class="block">
    <div class="title">Therapeutinnenverwaltung</div>
    <div class="content">Nutzen Sie diesen Bildschirm, um Therapeutinnen anzulegen oder zu bearbeiten.</div>
    <div class="columns block">
      <div class="column box is-4">
        <div class="field">
          <label for="therapistFilterInput"
                 class="field-label">
            Filter
          </label>
          <input id="therapistFilterInput"
                 class="field-body"
                 type="text"
                 v-model="therapistFilter"
                 v-debounce:300ms="reloadList">
        </div>
        <user-list :users="therapists" :selectedUser="selectedTherapist" @select="selectTherapist($event)"/>
        <div class="block mt-3">
          <div class="button is-primary"
               @click="newTherapist">
            Neue Therapeutin
          </div>
        </div>
      </div>
      <div class="column" v-if="selectedTherapist">
        <therapist-details :therapist="selectedTherapist" @update="reloadList"/>
      </div>
      <div v-else class="column ml-2 is-center">
        <span class="help is-info has-text-centered">Wählen Sie eine Therapeutin aus der Liste, um sie zu bearbeiten oder erstellen Sie eine neue.</span>
      </div>
    </div>
  </div>
</template>

<script>
import UserList from "@/components/UserList";
import TherapistDetails from "@/components/TherapistDetails";

export default {
  data() {
    return {
      therapists: [],
      selectedTherapist: undefined,
      therapistFilter: ''
    }
  },
  methods: {
    selectTherapist(therapist) {
      this.selectedTherapist = therapist
    },
    newTherapist() {
      this.selectedTherapist = {
        number: undefined,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        practice: ''
      }
    },
    reloadList() {
      this.selectedTherapist = undefined
      this.$api.get('/therapists', {
        params: {
          q: this.therapistFilter
        }
      }).then(response => this.therapists = response.data)
    }
  },
  mounted() {
    this.reloadList()
  },
  components: {TherapistDetails, UserList}
}
</script>