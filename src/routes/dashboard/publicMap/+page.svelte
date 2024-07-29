<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
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
                    L.marker(latlng).addTo(mymap).bindPopup("Property Location").openPopup();
                }
            });

            navigator.geolocation.getCurrentPosition(location => {
                const latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);

                mymap.flyTo(latlng, 15, {
                    animate: true,
                    duration: 0.5
                });
                L.circle(latlng, { radius: 300 }).addTo(mymap);
                L.marker(latlng).addTo(mymap);
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

<div id="mymaps"></div>
