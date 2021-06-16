<template>
  <nav class="navbar navbar-white bg-white justify-content-between" id="bar-style">
    <a class="navbar-brand" @click="navigateHome">Archedetector</a>
    <img class="img-responsive"
         src="@/assets/logo-groningen.svg"
         alt="" />
  </nav>
</template>

<script>
export default {
  name: "standardNavbar",
  methods: {
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