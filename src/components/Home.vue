<template>
  <div>
    <standard-navbar />
    <div class="d-flex">
      <router-link to="/mailing-list" tag="button">lists</router-link>
    </div>
  </div>

</template>

<script>
import StandardNavbar from "@/components/navbar/StandardNavbar";

export default {
  name: 'Home',
  components:{
    StandardNavbar
  },
}
</script>

<style>
</style>