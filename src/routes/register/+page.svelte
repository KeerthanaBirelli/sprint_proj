<script lang="ts">
  import type { PageData } from "./$types.js";
  import Register from "./Register.svelte";
  export let data: PageData;
</script>


<nav class="bg-gray-200 border-gray-200">
  <p>Create Your Account</p>
</nav>
<Register data={data.form} />
<footer class="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 ">
  <p>
    Already have an account? <a href="/login" class="md:text-blue-400">Login here</a>
  </p>
</footer>