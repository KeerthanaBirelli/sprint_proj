<!-- <slot></slot><script>import "../app.css";</script> -->

<script>
    // import Navbar from '$lib/Navbar.svelte';
    // import Footer from '$lib/Footer.svelte';
    import "../app.css";
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;
	$: ({ session, supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<!-- <Navbar /> -->
<slot />
<!-- <Footer /> -->