<template>
  <div class="w-100" v-if="page.content">
    <div class="w-100 bg-white" v-if="mailSelectedIdx!==-1">
      <div class="d-flex justify-content-between border-bottom" id="mail-list-header" >
        <div class="px-1 d-flex align-items-center">
          <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret>
            <template #button-content>
              <b-icon-tag></b-icon-tag>
            </template>
            <b-dropdown-form id="dropdown-form" text="Dropdown with form" ref="dropdown">
              <b-form-group>
                <b-form-checkbox-group
                    id="checkbox-group-2"
                    name="flavour-2"
                    v-model="page.content[mailSelectedIdx].tags">
                  <b-form-checkbox v-for="tag in tags" :key="tag.id" :value="tag">{{tag.name}}</b-form-checkbox>
                </b-form-checkbox-group>
                <b-button variant="primary" size="sm" @click="saveTags">Save</b-button>
              </b-form-group>
            </b-dropdown-form>
          </b-dropdown>
          <div class="p-1" v-for="tag in page.content[mailSelectedIdx].tags" :key="tag.id">
              <div class="p-1 shadow-sm rounded bg-light border" style="user-select: none;">
                {{tag.name}}
              </div>
          </div>
        </div>
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
        <p>
          From: {{ page.content[mailSelectedIdx].sentFrom }}
        </p>
        <p>
          Subject: {{ page.content[mailSelectedIdx].subject }}
        </p>
        <p>
          Date: {{ moment.unix(page.content[mailSelectedIdx].date).format("DD MMM YYYY hh:mm a") }}
        </p>
        <pre class="w-100">
           {{ page.content[mailSelectedIdx].body }}
         </pre>
      </div>
    </div>
    <div class="w-100 bg-white" v-else>
      <div class="d-flex justify-content-between border-bottom" id="mail-list-header" >
        <b-button class="m-1" size="sm" variant="primary" @click="downloadCSVData">
          Export to csv
        </b-button>
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


const url = "http://localhost:8080/api/v1/"

export default {
  name: "Mailbox",
  data(){
    return{
      mailSelectedIdx: -1,
      page: {},
      tags: [],
      selectedTags: []
    }
  },
  mounted() {
    axios.get(url+"tag").then((response) => {
      this.tags=response.data;
    })
    if(this.$route.params.query){
      let str = ""
      if(this.$route.params.id === 'all') {
        axios.get(url + "query-collection/" + this.$route.params.queryCollectionId).then(response => {
          let ids = ""
          let i = 0
          for(; i < response.data.mailingLists.length-1; i++){
            ids += response.data.mailingLists[i].id + ","
          }
          ids += response.data.mailingLists[i].id
          str = url + "email/search?q=" + this.$route.params.query + "&mailingListIds=" + ids + "&page=" + this.$route.params.page
          this.getApiRequest(str)
        })
      } else {
        str = url + "email/search?q=" + this.$route.params.query + "&mailingListIds=" + this.$route.params.id + "&page=" + this.$route.params.page
        this.getApiRequest(str)
      }
    } else {
      this.getMail(this.$route.params.page, this.$route.params.id)
    }
  },
  methods: {
    setSelectedMail(index) {
      if (index >= this.page.size) {
        this.nextPage()
        this.mailSelectedIdx = 0;
      } else if (index < 0) {
        this.prevPage()
        this.mailSelectedIdx = 19;
      }else {
        this.mailSelectedIdx = index;
      }
    },
    getApiRequest(url) {
      axios.get(url).then((response) => {
        this.page = response.data;
      }, (error) => {
        console.log(error);
      });
    },
    getMail(page_nr, id) {
      if (this.$route.params.id === "all") {
        this.getApiRequest(url + "query-collection/" + this.$route.params.queryCollectionId + "/email?page=" + page_nr + "&sort=date")
      } else {
        this.getApiRequest(url + "mailing-list/" + id + "/email?page=" + page_nr + "&sort=date")
      }
    },
    nextPage() {
      const page_nr = this.page.number + 1;
      if (this.$route.params.query) {
        this.$router.push({
          name: 'MailSearch',
          params: {id: this.$route.params.id, query: this.$route.params.query, page: page_nr}
        })
      } else {
        this.$router.push({name: 'Mail', params: {id: this.$route.params.id, page: page_nr}})
      }
    },
    prevPage() {
      const page_nr = this.page.number - 1;
      if (this.$route.params.query) {
        this.$router.push({
          name: 'MailSearch',
          params: {id: this.$route.params.id, query: this.$route.params.query, page: page_nr}
        })
      } else {
        this.$router.push({name: 'Mail', params: {id: this.$route.params.id, page: page_nr}})
      }
    },
    saveTags() {
      axios.post(url + "email", this.page.content[this.mailSelectedIdx]).then(() => {
      }, (error) => {
        console.log(error);
      });
    },
    downloadCSVData(){
      let csv = 'Id,Tags\n';
      this.page.content.forEach((email) => {
        csv += email.messageId + ','
        csv += '"['
        if(email.tags.length > 0) {
          let i = 0

          for (; i < email.tags.length - 1; i++) {
            csv += email.tags[i].name + ', '
          }
          csv += email.tags[i].name
        }
        csv += ']"\n'
      });

      const anchor = document.createElement('a');
      anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
      anchor.target = '_blank';
      anchor.download = 'search.csv';
      anchor.click();
    }
  },
  watch:{
    '$route.params': {
      handler: function(params) {
        if(params.query){
          let str = ""
          if(params.id === 'all') {
            axios.get(url + "query-collection/" + this.$route.params.queryCollectionId).then(response => {
              let ids = ""
              let i = 0
              for(; i < response.data.mailingLists.length-1; i++){
                ids += response.data.mailingLists[i].id + ","
              }
              ids += response.data.mailingLists[i].id
              str = url + "email/search?q=" + params.query + "&mailingListIds=" + ids + "&page=" + params.page
              this.getApiRequest(str)
            })

          } else {
            str = url + "email/search?q=" + params.query + "&mailingListIds=" + params.id + "&page=" +params.page
            this.getApiRequest(str)
          }
        } else {
          this.getMail(params.page, params.id)
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped>
#mail-list-header{
  height: 40px;
}
#mail-list{
  height: calc(100vh - (70px + 30px));
  width: calc(100vw - 300px);
}
#mail-view{
  padding: 10px;
  height: calc(100vh - (70px + 30px));
  width: calc(100vw - 300px);
}
#icon:hover{
  color: cornflowerblue;
}

</style>