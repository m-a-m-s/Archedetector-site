<template>
  <nav class="navbar justify-content-between" id="bar-style">
    <a class="ms-2 navbar-brand" @click="navigateHome" style="cursor: pointer">Archedetector</a>
    <form class="d-flex w-50 align-items-center" v-on:submit.prevent>
      <input class="w-50 mx-1" v-model="searchQuery" placeholder="Search" v-on:keydown.enter="search">
      <b-button size="sm" @click="search">submit</b-button>
    </form>
    <img class="img-responsive"
         src="@/assets/logo-groningen.svg"
         alt="" />
  </nav>
</template>

<script>
export default {
  name: "navbar",
  data(){
    return{
      searchQuery: "",
    }
  },
  methods: {
    search(){
      let q = this.searchQuery.replaceAll("+", "%2B")
      console.log(this.$route.name)
      if(this.$route.name === "Issue" || this.$route.name === "IssueSearch") {
        if(q==="") {
          this.$router.push({name: 'Issue', params: {id: this.$route.params.id, page: 0}})
        } else {
          this.$router.push({name: 'IssueSearch', params: {id: this.$route.params.id, query: q, page: 0}})
        }
      } else {
        if(q==="") {
          this.$router.push({name: 'Mail', params: {id: this.$route.params.id, page: 0}})
        } else {
          this.$router.push({name: 'MailSearch', params: {id: this.$route.params.id, query: q, page: 0}})
        }

      }

    },
    navigateHome(){
      this.$router.push({name:"Home"});
    }
  }
}
</script>

<style scoped>
#bar-style{
  height:70px
}
</style>