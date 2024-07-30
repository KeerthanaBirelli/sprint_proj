<script lang="ts">
    import Navbar from '$lib/Navbar.svelte';
    import Footer from '$lib/Footer.svelte';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    let email: string | null = null;
    const landAuthority: string[] = ['keerthana.birelli@gmail.com','kittu.birelli@gmail.com', 'sales@timechainlabs.io', 'authorize@example.com'];

    page.subscribe((p) => {
        if (p.url.searchParams.has('email')) {
            email = p.url.searchParams.get('email');
        }
    });
    // console.log(email);

    function checkAuthority(event: Event) {
        const mouseEvent = event as MouseEvent;
        if (email && !landAuthority.includes(email)) {
            mouseEvent.preventDefault();
            alert("Only land authorities can issue and update the property");
        }
    }

    onMount(() => {
        const links = document.querySelectorAll('.check-authority');
        links.forEach(link => {
            link.addEventListener('click', checkAuthority);
        });
    });

</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .content {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
  }

  .sidebar {
    width: 250px;
    background-color: #e5e7eb;
    color: white;
    position: fixed;
    top: 60px;
    bottom: 0;
    left: 0;
    padding-top: 20px;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .sidebar a {
    display: block;
    padding: 15px 20px;
    color: rgb(0, 0, 0);
    text-decoration: none;
    font-size: 18px;
    font-weight: bold;
  }

  .sidebar a:hover {
    background-color: #d1d5db;
  }

  .submenu a {
    display: block;
    padding: 10px 40px;
    color: rgb(0, 0, 0);
    text-decoration: none;
    font-size: 16px;
  }

  .submenu {
    display: none;
  }

  .sidebar a:hover .submenu {
    display: block;
  }

  .main-content {
    margin-left: 250px;
    padding: 80px 20px 20px 20px;
    background-color: transparent;
    box-sizing: border-box;
    overflow: hidden;
    flex-grow: 1;
  }

  .content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
    position: relative;
  }

  h1 {
    font-size: 48px;
    font-weight: bold;
    color: #2c3e50;
  }

  p {
    font-size: 24px;
    color: #2c3e50;
  }

  .footer-image {
    position: absolute;
    bottom: -80px;
    left: 50%;
    width: 100%;
    height: auto;
    transform: translateX(-50%);
    z-index: -1;
  }

  .footer-container {
    position: relative;
  }
</style>


<Navbar />

<div class="container">
  <div class="content">
    <nav class="sidebar">
      <!-- <a href="#">
        Property Issuance
        <div class="submenu">
          <a href="/dashboard/propertyIssuance" onclick={checkAuthority}>Issue New Property</a>
          <a href="#">Update Existing Property</a>
        </div>
      </a> -->
      <a href="#" class="check-authority">
        Property Issuance
        <div class="submenu">
          <a href="/dashboard/propertyIssuance" class="check-authority">Issue New Property</a>
          <a href="#" class="check-authority">Update Existing Property</a>
        </div>
      </a>
      <a href="/dashboard/publicMap">Public Map</a>
    </nav>

    <div class="main-content">
      <div class="content-wrapper">
        <h1 class="text-blue-400">Dashboard</h1>
        <p>Welcome</p>
        {#if email}
          <p>{email}!</p>
        {/if}
      </div>
    </div>
  </div>
</div>

<div class="footer-container">
  <img src="https://i.imgur.com/O2YqJJZ.png" alt="Decorative border" class="footer-image" />
</div>
<Footer />



