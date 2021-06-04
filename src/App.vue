<template>
  <div>
    <mail-navbar/>
    <div class="d-flex">
      <list-mailing-list @setMailingList="setMailingList($event)"/>
      <mailbox v-bind:mailing-list="mailingList"/>
    </div>
  </div>

</template>

<script>
import MailNavbar from "@/components/MailNavbar";
import ListMailingList from "@/components/ListMailingList";
import Mailbox from "@/components/Mailbox";

export default {
  name: 'App',
  components:{
    MailNavbar,
    ListMailingList,
    Mailbox
  },
  data(){
    return{
      mailingList: {},
    }
  },
  methods: {
    setMailingList(mailingList){
      this.mailingList = mailingList;
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
