<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    // import type { PageData } from './$types';

    type Location = {
        latitude: string | null;
        longitude: string | null;
    };
    type PageData = {
        locations: Location[];
    };

    let map: any;
    let locations: Location[] = [];
       $: {
        const data = $page.data as unknown as PageData;
        locations = data.locations;
    }
    onMount(async () => {
        if (typeof window !== 'undefined') {
            const L = await import('leaflet');
            await import('leaflet/dist/leaflet.css');
            
            var mymap = L.map("mymaps").setView([51.505, -0.09], 3);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mymap);

            console.log('Locations:', locations);

            locations.forEach(({ latitude, longitude }) => {
                if (latitude !== null && longitude !== null) {
                    const latlng = new L.LatLng(parseFloat(latitude), parseFloat(longitude));
                    const marker = L.marker(latlng).addTo(mymap).bindPopup("Property Location").openPopup();

                    marker.on('click', () => {
                        goto(`/dashboard/viewProperty?latitude=${latitude}&longitude=${longitude}`);
                    });
                }
            });

            navigator.geolocation.getCurrentPosition(location => {
                const latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);

                mymap.flyTo(latlng, 15, {
                    animate: true,
                    duration: 0.5
                });
                L.circle(latlng, { radius: 300 }).addTo(mymap);
                L.marker(latlng).addTo(mymap).bindPopup("You are here").openPopup();
            },
            error => console.log(error),
            { enableHighAccuracy: true });
        }
    });
</script>

<style>
    #mymaps {
        height: 100vh;
        width: 100%;
    }
</style>

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
<div id="mymaps"></div>
