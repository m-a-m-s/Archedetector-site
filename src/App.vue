<template>
  <div class="container-fluid vh-100">
    <div class="row" style="height: 10%">
      navbar
    </div>
    <div class="row" style="height: 90%">
      <div class="col-1 h-100">
        hoi
      </div>
      <div class="col-11 h-100">
        <div class="row" style="height: 5%">
          <div>
            {{page.size*page.number+1}}-{{page.size*(page.number)+page.numberOfElements}} of {{page.totalElements}}
            <button v-on:click="getPage(page, -1)" :disabled="page.first">Prev</button>
            <button v-on:click="getPage(page, 1)" :disabled="page.last">Next</button>
          </div>
        </div>
        <div class="row overflow-auto" style="height: 95%">
          <ul class="list-group">
            <li class="list-group-item" v-for="mail of page.content" :key="mail.id">
              {{mail.sentFrom}}
              {{mail.subject}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios"

const url = "http://localhost:8080/"

export default {
  name: 'App',
  data(){
    return{
      page: {}
    }
  },
  async created(){
    try {
      const res = await axios.get(url + "mailing-list/1/mail?page=0&size=50&sort=id");
      this.page = res.data;
      console.log(this.page)
    } catch (e) {
      console.error(e)
    }
  },
  methods: {
    async getPage(page, offset){
      try {
        const pageNumber =  page.number + offset
        const res = await axios.get(url + "mailing-list/1/mail?page=" + pageNumber + "&size=50&sort=id");
        this.page = res.data;
        console.log(this.page)
      } catch (e) {
        console.error(e)
      }
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
