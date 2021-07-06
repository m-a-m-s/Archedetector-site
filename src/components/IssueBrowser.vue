<template>
  <div class="w-100">
    <div class="w-100 bg-white" v-if="issueSelectedIdx!==-1">
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
                    v-model="page.content[issueSelectedIdx].tags">
                  <b-form-checkbox v-for="tag in tags" :key="tag.id" :value="tag">{{tag.name}}</b-form-checkbox>
                </b-form-checkbox-group>
                <b-button variant="primary" size="sm" @click="saveIssue">Save</b-button>
              </b-form-group>
            </b-dropdown-form>
          </b-dropdown>
          <div class="p-1" v-for="tag in page.content[issueSelectedIdx].tags" :key="tag.id">
            <div class="p-1 shadow-sm rounded bg-light border" style="user-select: none;">
              {{tag.name}}
            </div>
          </div>
        </div>
        <div class="my-auto" style="user-select: none">
          <b-icon-arrow-left id="icon" v-on:click="issueSelectedIdx = -1" scale="1.5"></b-icon-arrow-left>
          {{page.number*page.size+this.issueSelectedIdx+1}} of {{ page.totalElements }}
          <b-icon-caret-left-fill style="color: grey" class="mx-lg-3" scale="1.5" v-if="page.first && issueSelectedIdx===0"></b-icon-caret-left-fill>
          <b-icon-caret-left-fill id="icon" v-on:click="setSelectedIssue(issueSelectedIdx-1)" class="mx-lg-3" scale="1.5" v-else></b-icon-caret-left-fill>
          <b-icon-caret-right-fill style="color: grey" class="mx-lg-5" scale="1.5" v-if="page.last && issueSelectedIdx+1===page.numberOfElements"></b-icon-caret-right-fill>
          <b-icon-caret-right-fill id="icon" v-on:click="setSelectedIssue(issueSelectedIdx+1)" class="mx-lg-5" scale="1.5" v-else></b-icon-caret-right-fill>
        </div>
      </div>
      <div class="overflow-auto rounded-0" id="mail-view">
        <div class="m-4">
          <h5>
            {{ page.content[issueSelectedIdx].key }}
          </h5>

        </div>
        <b class="m-4"> description: </b>
        <div class="m-4" style="overflow-x: auto; word-break: break-word; white-space: pre-wrap;">
           {{ page.content[issueSelectedIdx].description }}
        </div>
        <b class="m-4"> Comments: </b>
        <div class="m-4" v-for="comment in issueSelectedComments" :key="comment.id">
          <hr>
          {{ comment.body }}
        </div>
      </div>
    </div>
    <div class="w-100 bg-white" v-else>
      <div class="d-flex justify-content-end border-bottom" id="mail-list-header" >
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
            @click="setSelectedIssue(index)"
            action
            v-for="(issue, index) in page.content" :key="issue.id"
            id="list-style">
          <div>
            key: {{ issue.key }}
          </div>
          <div>
            summary: {{ issue.summary }}
          </div>
          <div class="d-flex flex-row" v-if="issue.tags.length > 0">
            <div v-for="tag in issue.tags" :key="tag.id">
              <div class="me-2 p-1 shadow-sm rounded border bg-light" style="user-select: none;">
                {{tag.name}}
              </div>
            </div>
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
  name: "IssueBrowser",
  data(){
    return{
      issueSelectedComments: [],
      issueSelectedIdx: -1,
      tags: [],
      page: {},
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
          for(; i < response.data.issueLists.length-1; i++){
            ids += response.data.issueLists[i].id + ","
          }
          ids += response.data.issueLists[i].id
          str = url + "issue/search?q=" + this.$route.params.query + "&issueListIds=" + ids + "&page=" + this.$route.params.page + "&size=20"
          this.apiGetIssues(str)
        })
      } else {
        str = url + "issue/search?q=" + this.$route.params.query + "&issueListIds=" + this.$route.params.id + "&page=" + this.$route.params.page + "&size=20"
        this.apiGetIssues(str)
      }
    } else {
      if(this.$route.params.id === 'all') {
        this.apiGetIssues(url + "query-collection/" + this.$route.params.queryCollectionId + "/issue?page=" + this.$route.params.page);
      }else{
        this.apiGetIssues(url + "issue-list/" + this.$route.params.id + "/issue?page=" + this.$route.params.page);
      }
    }
  },
  methods: {
    apiGetIssues(apiUrl){
      axios.get(apiUrl).then((response) => {
        this.page = response.data;
        console.log(this.page)
      }, (error) => {
        console.log(error);
      });
    },
    saveIssue(){
      axios.post(url + "issue", this.page.content[this.issueSelectedIdx]).then(() => {
      }, (error) => {
        console.log(error);
      });
    },
    setSelectedIssue(index){
      if(index >= this.page.size){
        this.issueSelectedIdx=0
        this.nextPage()
      } else if(index < 0){
        this.issueSelectedIdx=19
        this.prevPage()
      }else {
        axios.get(url + "issue/" + this.page.content[index].id + "/comment").then((response) => {
          this.issueSelectedComments = response.data;
        }, (error) => {
          console.log(error);
        });
        this.issueSelectedIdx = index;
      }
    },
    nextPage(){
      const page_nr = this.page.number + 1;
      if (this.$route.params.query) {
        this.$router.push({ name: 'IssueSearch', params: { id: this.$route.params.id, page: page_nr , query: this.$route.params.query}})
      } else {
        this.$router.push({ name: 'Issue', params: { id: this.$route.params.id, page: page_nr }})
      }

    },
    prevPage() {
      const page_nr = this.page.number - 1;
      if (this.$route.params.query) {
        this.$router.push({
          name: 'IssueSearch',
          params: {id: this.$route.params.id, page: page_nr, query: this.$route.params.query}
        })
      } else {
        this.$router.push({name: 'Issue', params: {id: this.$route.params.id, page: page_nr}})
      }
    }
  },
  watch:{
    '$route.params': {
      handler: function() {
        if(this.$route.params.query){
          let str = ""
          if(this.$route.params.id === 'all') {
            axios.get(url + "query-collection/" + this.$route.params.queryCollectionId).then(response => {
              let ids = ""
              let i = 0
              for(; i < response.data.issueLists.length-1; i++){
                ids += response.data.issueLists[i].id + ","
              }
              ids += response.data.issueLists[i].id
              str = url + "issue/search?q=" + this.$route.params.query + "&issueListIds=" + ids + "&page=" + this.$route.params.page + "&size=20"
              this.apiGetIssues(str)
            })
          } else {
            str = url + "issue/search?q=" + this.$route.params.query + "&issueListIds=" + this.$route.params.id + "&page=" + this.$route.params.page + "&size=20"
            this.apiGetIssues(str)
          }
        } else {
          if(this.$route.params.id === 'all') {
            this.apiGetIssues(url + "query-collection/" + this.$route.params.queryCollectionId + "/issue?page=" + this.$route.params.page);
          }else{
            this.apiGetIssues(url + "issue-list/" + this.$route.params.id + "/issue?page=" + this.$route.params.page);
          }
        }
      },
      deep: true
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
}
#mail-view{
  padding: 10px;
  height: calc(100vh - (70px + 40px));
  width: calc(100vw - 300px);
}
#icon:hover{
  color: cornflowerblue;
}

</style>