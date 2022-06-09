<template>
	<div>
	<standard-navbar/>
	<b-card header-tag="header" class="mt-5">
		<template #header>
			<h5>Reindex the database?</h5>
		</template>
		<div class="overflow-auto justify-content-center">
			<b-button pill size="sm" variant="danger" class="mb-1" @click="regenerateIndexIssues()">
				Regenerate Index for Issue Lists
			</b-button>
		</div>
	</b-card>
	</div>
</template>

<script>
import StandardNavbar from "@/components/navbar/StandardNavbar";
import axios from "axios";

const url = process.env.VUE_APP_ARCHEDETECOR_API

export default {
	name: 'Reindex',
	components: {
		StandardNavbar
	},
	methods: {
		regenerateIndexIssues(){
			if (confirm("Are you sure you want to reindex the issue database? This might take a while.")) {
				axios.post(url + "issues/reindex").then(() => {
					this.$router.push({name: 'Home'})
				})
			}
		}
	}
}
</script>

<style>
</style>