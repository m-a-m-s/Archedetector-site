<template>
  <div class="w-100">
    <div class="w-100 bg-white" v-if="mailSelectedIdx!==-1">
      <div class="d-flex justify-content-end" id="mail-list-header" >
        <div class="my-auto" style="user-select: none">
          <b-icon-arrow-left v-on:click="mailSelectedIdx = -1" scale="1.5"></b-icon-arrow-left>
          {{page.number*page.size+this.mailSelectedIdx+1}} of {{ page.totalElements }}
          <b-icon-caret-left-fill style="color: grey" class="mx-lg-3" scale="1.5" v-if="page.first && mailSelectedIdx===0"></b-icon-caret-left-fill>
          <b-icon-caret-left-fill id="icon" v-on:click="getPreviousMail" class="mx-lg-3" scale="1.5" v-else></b-icon-caret-left-fill>
          <b-icon-caret-right-fill style="color: grey" class="mx-lg-5" scale="1.5" v-if="page.last && mailSelectedIdx+1===page.numberOfElements"></b-icon-caret-right-fill>
          <b-icon-caret-right-fill id="icon" v-on:click="getNextMail" class="mx-lg-5" scale="1.5" v-else></b-icon-caret-right-fill>
        </div>
      </div>
      <div class="overflow-auto rounded-0" id="mail-list">
        <div>
          From: {{ page.content[mailSelectedIdx].sentFrom }}
        </div>
        <div>
          subject: {{ page.content[mailSelectedIdx].subject }}
        </div>
         <pre class="w-100">
           {{ page.content[mailSelectedIdx].body }}
         </pre>
      </div>
    </div>
    <div class="w-100 bg-white" v-else>
      <div class="d-flex justify-content-end" id="mail-list-header" >
        <div class="my-auto" style="user-select: none">
          {{page.number*page.size+1}}-{{page.number*page.size + page.numberOfElements}} of {{ page.totalElements }}
          <b-icon-caret-left-fill style="color: grey" class="mx-lg-3" scale="1.5" v-if="page.first"></b-icon-caret-left-fill>
          <b-icon-caret-left-fill id="icon" v-on:click="getMail(page.number-1)" class="mx-lg-3" scale="1.5" v-else></b-icon-caret-left-fill>
          <b-icon-caret-right-fill style="color: grey" class="mx-lg-5" scale="1.5" v-if="page.last"></b-icon-caret-right-fill>
          <b-icon-caret-right-fill id="icon" v-on:click="getMail(page.number+1)" class="mx-lg-5" scale="1.5" v-else></b-icon-caret-right-fill>
        </div>
      </div>
      <b-list-group class="overflow-auto rounded-0" id="mail-list" flush>
        <b-list-group-item
            @click="setSelectedMail(index)"
            action
            v-for="(mail, index) in page.content" :key="mail.id"
            id="list-style">
          <div>
            From: {{ mail.sentFrom }}
          </div>
          <div>
            Subject: {{ mail.subject }}
          </div>
          <div>
            Date: {{ moment.unix(mail.date).format("DD MMM YYYY hh:mm a") }}
          </div>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
import axios from "axios";


const url = "http://localhost:8080/"

export default {
  name: "Mailbox",
  props: {
    mailingList: {},
  },
  data(){
    return{
      mailSelectedIdx: -1,
      loading: false,
      page: {},
    }
  },
  watch: {
    mailingList: {
      handler: function(){
        this.mailSelectedIdx = -1;
        this.getMail(0);
      }
    }
  },
  methods: {
    setSelectedMail(index){
      this.mailSelectedIdx = index;
    },
    async getNextMail(){
      if(this.mailSelectedIdx+1 < this.page.numberOfElements){
        this.mailSelectedIdx += 1;
      }else{
        await this.getMail(this.page.number+1)
        this.mailSelectedIdx = 0;
      }
    },
    async getPreviousMail(){
      if(this.mailSelectedIdx > 0){
        this.mailSelectedIdx -= 1;
      }else{
        await this.getMail(this.page.number-1)
        this.mailSelectedIdx = this.page.size - 1;
      }
    },
    getMail(page_nr){
      axios.get(url + "mailing-list/" + this.mailingList.id + "/email?page=" + page_nr + "&sort=date&size=50").then((response) => {
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
  width: calc(100vw - 300px);
  border: 1px solid darkgray;
}
#icon:hover{
  color: cornflowerblue;
}
</style>