<template>
  <div>
    <b-list-group id="list-style" flush>
      <b-list-group-item
          class="border-0"
          action
          @click="setMailingList(mailingList)"
          v-bind:class="{ 'active' : isSelected(mailingList) }"
          v-for="mailingList in listMailingList" :key="mailingList.id"
          >
        {{ mailingList.name }}
      </b-list-group-item>
    </b-list-group>
    <div class="d-flex justify-content-center">
      <b-button id="show-btn" @click="$bvModal.show('add-mailing-list')">Add List</b-button>
      <div v-if="loading">
        <b-spinner></b-spinner>
      </div>
    </div>
    <b-modal id="add-mailing-list" hide-footer hide-header @ok:="onSubmit" @cancel="onCancel">
      <b-form>
        <b-form-group id="input-group-1" label="Mailing list name:" label-for="input-1">
          <b-form-input
              id="input-1"
              v-model="form.name"
              placeholder="Enter name"
              required
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-2" label="Url to list in http://mail-archives.apache.org/mod_mbox/:" label-for="input-2">
          <b-form-input
              id="input-2"
              v-model="form.url"
              placeholder="Enter url"
              required
          ></b-form-input>
        </b-form-group>
      </b-form>
      <b-button class="mt-3" block @click="onCancel">cancel</b-button>
      <b-button class="mt-3" block @click="onSubmit">submit</b-button>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";

const url = "http://localhost:8080/"

export default {
  name: "MailingListComponent",
  data(){
    return{
      loading: false,
      form: {
        name: '',
        url: '',
      },
      listMailingList: [],
      mailingList: {}
    }
  },
  async created(){
    try {
      const res = await axios.get(url + "mailing-list/");
      this.listMailingList = res.data;
    } catch (e) {
      console.error(e)
    }
  },
  methods: {
    setMailingList(mailingList){
      this.mailingList = mailingList;
      this.$emit('setMailingList', mailingList);
    },
    isSelected (mailingList) {
      return mailingList.id === this.mailingList.id;
    },
    onSubmit() {
      this.$bvModal.hide('add-mailing-list')
      this.loading = true;
      axios.post(url + "mailing-list/add-from-apache-archive", this.form).then((response) => {
        this.loading = false;
        this.listMailingList.push(response.data)

      }, (error) => {
        this.loading = false;
        console.log(error);
      });
    },
    onCancel() {
      console.log("cancel")
      this.$bvModal.hide('add-mailing-list')
      this.form.url = ''
      this.form.name = ''
    }
  }
}

</script>

<style scoped>
#list-style{
  width: 200px
}
</style>