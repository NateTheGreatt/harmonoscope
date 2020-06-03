<script>
	import Harmonoscope from './components/Harmonoscope.svelte'
</script>

<main>
	<h1>Harmonoscope</h1>
	<Harmonoscope />
</main>

<style>
	main {
		margin: 0 auto;
	}

	h1 {
		color: #fff;
		text-transform: uppercase;
		font-size: 2em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>