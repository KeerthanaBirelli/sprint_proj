<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    type PropertyDetails = {
        propertyId: string;
        latitude: string;
        longitude: string;
        areaCity: string;
        state: string;
        ownerPublicAddress: string;
        defaultBidAmount: string;
    };

    let propertyDetails: PropertyDetails | null = null;

    $: {
        const data = $page.data as unknown as { propertyDetails: PropertyDetails };
        propertyDetails = data.propertyDetails;
    }

    function goToBidForm() {
        if (propertyDetails) {
            const { propertyId, latitude, longitude } = propertyDetails;
            goto(`/dashboard/bid?propertyId=${propertyId}&latitude=${latitude}&longitude=${longitude}`);
        }
    }
</script>

<!-- <style>
    .property-details {
        margin: 20px;
    }
    .bid-button {
         display: flex;
    justify-content: center;
  }

  button {
    width: 100%;
    max-width: 200px;
    padding: 10px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
</style> -->

<nav class="bg-gray-200 border-gray-200">
    <div class=" bg-gray-200 hidden w-full md:block md:w-auto" id="navbar-default">
        <ul class=" font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-200  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
            <li><p>View Property Details</p></li>
            <li class="top-right">
                <a href="/dashboard" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-400 md:p-0" aria-current="page">Go to dashboard</a>
            </li>
        </ul>
    </div>
</nav>

<main>
    <h1><strong>Property Details</strong></h1>
{#if propertyDetails}
    <div class="details">
        <!-- <h1><strong>Property Details</strong></h1> -->
        <p><strong>Property ID:</strong> {propertyDetails.propertyId}</p>
        <p><strong>Latitude:</strong> {propertyDetails.latitude}</p>
        <p><strong>Longitude:</strong> {propertyDetails.longitude}</p>
        <p><strong>Area City:</strong> {propertyDetails.areaCity}</p>
        <p><strong>State:</strong> {propertyDetails.state}</p>
        <p><strong>Owner Public Address:</strong> {propertyDetails.ownerPublicAddress}</p>
        <p><strong>Default Bid Amount:</strong> {propertyDetails.defaultBidAmount}</p>
    </div>
    <div class="bid-button">
        <!-- <button on:click={goToBidForm}>Bid for the Property</button> -->
         <button>Bid for the Property</button>
    </div>
{:else}
    <p>Loading property details...</p>
{/if}
</main>
<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
    }

    h1 {
        margin-bottom: 20px;
        color: #333;
        font-size: 36px; 
    }

    .details {
        width: 100%;
        max-width: 600px;
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
    }

    .details p {
        margin-bottom: 10px;
        font-size: 16px;
        color: #333;
    }

     .bid-button {
         display: flex;
    justify-content: center;
  }
    button {
    width: 100%;
    max-width: 200px;
    padding: 10px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

     button:hover {
    background-color: #0056b3;
  }
</style>

