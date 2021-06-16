<template>
  <div>
    <mail-navbar />
    <div class="d-flex">
      <list-mailing-list/>
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>

</template>

<script>
import MailNavbar from "@/components/navbar/MailNavbar";
import ListMailingList from "@/components/ListMailingList";

export default {
  name: 'MailingList',
  components:{
    MailNavbar,
    ListMailingList,
  },
}
</script>

<style>
</style>