<template>
  <div class="w-100" v-if="page.content">
    <div class="w-100 bg-white" v-if="mailSelectedIdx!==-1">
      <div class="d-flex justify-content-end" id="mail-list-header" >
        <div class="my-auto" style="user-select: none">
          <b-icon-arrow-left id="icon" v-on:click="mailSelectedIdx = -1" scale="1.5"></b-icon-arrow-left>
          {{page.number*page.size+this.mailSelectedIdx+1}} of {{ page.totalElements }}
          <b-icon-caret-left-fill style="color: grey" class="mx-lg-3" scale="1.5" v-if="page.first && mailSelectedIdx===0"></b-icon-caret-left-fill>
          <b-icon-caret-left-fill id="icon" v-on:click="setSelectedMail(mailSelectedIdx-1)" class="mx-lg-3" scale="1.5" v-else></b-icon-caret-left-fill>
          <b-icon-caret-right-fill style="color: grey" class="mx-lg-5" scale="1.5" v-if="page.last && mailSelectedIdx+1===page.numberOfElements"></b-icon-caret-right-fill>
          <b-icon-caret-right-fill id="icon" v-on:click="setSelectedMail(mailSelectedIdx+1)" class="mx-lg-5" scale="1.5" v-else></b-icon-caret-right-fill>
        </div>
      </div>
      <div class="overflow-auto rounded-0" id="mail-view">
        <div>
          From: {{ page.content[mailSelectedIdx].sentFrom }}
        </div>
        <div>
          Subject: {{ page.content[mailSelectedIdx].subject }}
        </div>
        <div>
          Date: {{ moment.unix(page.content[mailSelectedIdx].date).format("DD MMM YYYY hh:mm a") }}
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
          <b-icon-caret-left-fill id="icon" @click="prevPage" class="mx-lg-3" scale="1.5" v-else></b-icon-caret-left-fill>
          <b-icon-caret-right-fill style="color: grey" class="mx-lg-5" scale="1.5" v-if="page.last"></b-icon-caret-right-fill>
          <b-icon-caret-right-fill id="icon" @click="nextPage" class="mx-lg-5" scale="1.5" v-else></b-icon-caret-right-fill>
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
  data(){
    return{
      mailSelectedIdx: -1,
      loading: false,
      page: {},
    }
  },
  mounted() {
    if(this.$route.params.query){
        const str = url + "email/search?q=" + this.$route.params.query + "&id=" + this.$route.params.id + "&page=" + this.$route.params.page
        console.log(str)
        this.getApiRequest(str)
    } else {
      this.getMail(this.$route.params.page, this.$route.params.id)
    }
  },
  methods: {
    setSelectedMail(index){
      if(index >= this.page.size){
        this.nextPage()
      } else if(index < 0){
        this.prevPage()
      }
      this.mailSelectedIdx = index;
    },
    getApiRequest(url){
      axios.get(url).then((response) => {
        this.loading = false;
        this.page = response.data;
        console.log(this.page)
      }, (error) => {
        this.loading = false;
        console.log(error);
      });
    },
    getMail(page_nr, id){
      this.getApiRequest(url + "mailing-list/" + id + "/email?page=" + page_nr + "&sort=date")
    },
    nextPage(){
      const page_nr = this.page.number + 1;
      if(this.$route.params.query){
        this.$router.push({ name: 'Search', params: { id: this.$route.params.id, query: this.$route.params.query, page: page_nr}})
      } else {
        this.$router.push({ name: 'Mail', params: { id: this.$route.params.id, page: page_nr }})
      }
    },
    prevPage() {
      const page_nr = this.page.number - 1;
      if (this.$route.params.query) {
        this.$router.push({
          name: 'Search',
          params: {id: this.$route.params.id, query: this.$route.params.query, page: page_nr}
        })
      } else {
        this.$router.push({name: 'Mail', params: {id: this.$route.params.id, page: page_nr}})
      }
    }
  },

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
#mail-view{
  padding: 10px;
  height: calc(100vh - (70px + 40px));
  width: calc(100vw - 300px);
  border: 1px solid darkgray;
}
#icon:hover{
  color: cornflowerblue;
}
</style>