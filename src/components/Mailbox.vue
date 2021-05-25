<template>
  <div class="w-100 bg-white">
    <div class="d-flex justify-content-end" id="mail-list-header" >
      <div class="my-auto">
        {{page.number*page.size+1}}-{{page.number*page.size + page.numberOfElements}} of {{ page.totalElements }}
        <b-icon-caret-left-fill style="color: grey" class="mx-lg-3" scale="1.5" v-if="page.first"></b-icon-caret-left-fill>
        <b-icon-caret-left-fill id="icon" v-on:click="getMail(page.number-1)" class="mx-lg-3" scale="1.5" v-else></b-icon-caret-left-fill>
        <b-icon-caret-right-fill style="color: grey" class="mx-lg-5" scale="1.5" v-if="page.last"></b-icon-caret-right-fill>
        <b-icon-caret-right-fill id="icon" v-on:click="getMail(page.number+1)" class="mx-lg-5" scale="1.5" v-else></b-icon-caret-right-fill>
      </div>
    </div>
    <b-list-group class="overflow-auto rounded-0" id="mail-list" flush>
      <b-list-group-item
          action
          v-for="mail in page.content" :key="mail.id"
          id="list-style">
        <div>
          From: {{ mail.sentFrom }}
        </div>
        <div>
          Subject: {{ mail.subject }}
        </div>
        <div>
          Date: {{ mail.date }}
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
import axios from "axios";

const url = "http://localhost:8080/"

export default {
  name: "Mailbox",
  props: {
    mailingList: {}
  },
  data(){
    return{
      loading: false,
      page: {},
    }
  },
  watch: {
    mailingList: {
      handler: function(){
        this.getMail(0)
      }
    }
  },
  methods: {
    getMail(page_nr){
      axios.get(url + "mailing-list/" + this.mailingList.id + "/mail?page=" + page_nr).then((response) => {
        this.loading = false;
        this.page = response.data;
        console.log(this.page)
      }, (error) => {
        this.loading = false;
        console.log(error);
      });
    }
  }
}
</script>

<style scoped>
#mail-list-header{
  height: 40px;
}
#mail-list{
  height: calc(100vh - (70px + 40px));
  border: 1px solid darkgray;
}
#icon:hover{
  color: cornflowerblue;
}
</style>