<template>
  <nav class="navbar navbar-white bg-white justify-content-between" id="bar-style">
    <a class="navbar-brand">Archedetector</a>
    <form class="d-flex">
      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
    <img class="img-responsive"
         src="@/assets/logo-groningen.svg"
         alt="" />
  </nav>
</template>

<script>
export default {
  name: "navbar"
}
</script>

<style scoped>
#bar-style{
  height:70px
}
</style>