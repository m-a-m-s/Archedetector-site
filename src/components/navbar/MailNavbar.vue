<template>
  <nav class="navbar navbar-white bg-white justify-content-between" id="bar-style">
    <a class="navbar-brand" @click="navigateHome">Archedetector</a>
    <form class="d-flex w-50" v-on:submit.prevent>
      <input class="w-50" v-model="searchQuery" placeholder="Search" v-on:keydown.enter="search">
      <b-button class="mt-3" @click="search">submit</b-button>
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
      this.$router.push({ name: 'Search', params: { id: this.$route.params.id, query: this.searchQuery, page: 0 }})
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