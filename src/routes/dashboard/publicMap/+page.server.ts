import { createClient } from '@supabase/supabase-js';
import type { Load } from '@sveltejs/kit';
import axios from 'axios';

const supabaseUrl = 'https://xkrknllhmcwyhtbbnnvp.supabase.co';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key are required');
}
const supabase = createClient(supabaseUrl, supabaseKey);
console.log("supabase connected");

const API_KEY = 'mainnet_03138ebf775639f46fe1123711fbfb40';

const fetchLatLongFromTxid = async (txid: string) => {
    console.log("Fetching LatLong for TXID:", txid);
    try {
        const response = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txid}`, {
            headers: {
                'woc-api-key': API_KEY
            }
        });

        const transactionData = response.data;
        const final = transactionData.vout[0].scriptPubKey.asm;
        // console.log("content:", final);

        function hexToAscii(hex: string): string {
            let str = '';
            for (let i = 0; i < hex.length; i += 2) {
                str += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
            }
            return str;
        }

        const parts = final.split(' ');
        const hexStrings = parts.filter(part => /^[0-9a-fA-F]+$/.test(part));
        const decodedData = hexStrings.map(hex => hexToAscii(hex));
        const latitude = decodedData[1];
        const longitude = decodedData[2];
        console.log("Latitude:", latitude, "Longitude:", longitude);

        return { latitude, longitude };
    } catch (error) {
        console.error('Error fetching location data from WhatsOnChain:', error);
        return { latitude: null, longitude: null };
    }
};

const getTransactionLocations = async () => {
    try {
        console.log("Fetching data from Supabase");
        const { data, error } = await supabase.from('transactions').select('txid');
        console.log("Supabase Data:", data);

        if (error) {
            console.error('Error fetching data from Supabase:', error);
            throw new Error(error.message);
        }

        if (!data) {
            console.log("No data found in Supabase");
            return [];
        }

        console.log("Mapping transactions to lat/long...");
        const locations = [];
        for (const { txid } of data) {
            const location = await fetchLatLongFromTxid(txid);
            locations.push(location);
        }
        console.log("Locations:", locations);
        return locations;
    } catch (error) {
        console.error('Error in getTransactionLocations:', error);
        throw error;
    }
};

export const load: Load = async () => {
    try {
        const locations = await getTransactionLocations();
        console.log("Locations fetched successfully");
        return { locations  };
    } catch (error) {
        console.error('Error fetching locations:', error);
        return { locations: [], error: 'Failed to fetch locations'  };
    }
};
