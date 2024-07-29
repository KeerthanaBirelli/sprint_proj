<script lang="ts">
  import type { PageData } from "./$types.js";
  import Login from "./Login.svelte";
  export let data: PageData;
</script>

<nav class="bg-gray-200 border-gray-200">
  <p>Welcome Back</p>
</nav>
<Login data={data.form} />
<footer class="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 ">
  <p>
    Don't have an account? <a href="/register" class="md:text-blue-400">Register now</a>
  </p>
</footer>