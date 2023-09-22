<template>
	<div class="row">
		<div class="col-md-12">
			<snake :size="20" :length="5"></snake>
		</div>
	</div>
</template>

<script>
import Snake from './../components/snake'

export default {
	components: {
		Snake,
	},
}
</script>
