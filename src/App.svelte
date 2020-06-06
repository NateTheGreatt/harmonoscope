<script>
	import Harmonoscope from './components/Harmonoscope.svelte'
</script>

<main>
	<Harmonoscope />
</main>

<style scoped=true>
	main {
		margin: 0 auto;
	}

	h1 {
		color: #fff;
		text-transform: uppercase;
		font-size: 2em;
		font-weight: 100;
		position: absolute;
		top: 10px;
		left: 10px;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>