<template>
  <div class="border-end border-top" id="list-style">
    <b-list-group class="overflow-auto" style="width: 300px;   height: calc(100vh - (70px));" flush>
      <b-nav vertical pills>
        <b-nav-item
            :to="{ name: 'Mail', params: { id: 'all', page: 0}}">
          <b> Browse All Maillists </b>
        </b-nav-item>
        <b-nav-item
            v-for="mailingList in listMailingList" :key="mailingList.id"
            :to="{ name: 'Mail', params: { id: mailingList.id, page: 0}}">
          {{mailingList.name}}
        </b-nav-item>
      </b-nav>
      <b-nav vertical pills>
        <b-nav-item
            :to="{ name: 'Issue', params: { id: 'all', page: 0}}">
          <b> Browse All Issues </b>
        </b-nav-item>
        <b-nav-item
            v-for="issueList in listIssueList" :key="issueList.id"
            :to="{ name: 'Issue', params: { id: issueList.id, page: 0}}">
          {{issueList.name}}
        </b-nav-item>
      </b-nav>
    </b-list-group>
  </div>
</template>

<script>
import axios from "axios";

const url = "http://localhost:8080/api/v1/"

export default {
  name: "QueryCollectionSidebar",
  data(){
    return{
      loading: false,
      form: {
        name: '',
        url: '',
        git: false,
        jira: false
      },
      queryCollection: {},
      listMailingList: [],
      listIssueList: [],
      issueList: {},
      mailingList: {}
    }
  },
  async created(){
    try {
      const res = await axios.get(url + "query-collection/" + this.$route.params.queryCollectionId);
      this.queryCollection = res.data
      this.listMailingList = res.data.mailingLists;
      this.listIssueList = res.data.issueLists;
    } catch (e) {
      console.error(e)
    }
  }
}

</script>

<style scoped>
#list-style{
  width: 300px;
  height: calc(100vh - (70px));
}
</style>