import { createClient } from '@supabase/supabase-js';
import type { Load } from '@sveltejs/kit';
import axios from 'axios';

// Initialize Supabase client
const supabaseUrl = 'https://xkrknllhmcwyhtbbnnvp.supabase.co';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key are required');
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('supabase connected');

const API_KEY = 'mainnet_03138ebf775639f46fe1123711fbfb40';

// Function to fetch property details from the blockchain using transaction ID
const fetchPropertyDetailsFromTxid = async (txid: string, propertyId: string) => {
    try {
        const response = await axios.get(`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${txid}`, {
            headers: { 'woc-api-key': API_KEY }
        });

        const transactionData = response.data;
        const final = transactionData.vout[0].scriptPubKey.asm;

        function hexToAscii(hex: string): string {
            let str = '';
            for (let i = 0; hex.length > 0; i++) {
                str += String.fromCharCode(parseInt(hex.substring(0, 2), 16));
                hex = hex.substring(2);
            }
            return str;
        }
        

        const parts = final.split(' ');
        const hexStrings = parts.filter(part => /^[0-9a-fA-F]+$/.test(part));
        // console.log(hexStrings);
        const decodedData = hexStrings.map(hex => hexToAscii(hex));

        // const propertyId = propertyId;
        const latitude = decodedData[1];
        const longitude = decodedData[2];
        const areaCity = decodedData[3];
        const state = decodedData[4];
        const ownerPublicAddress = hexStrings[5] || '';
        const defaultBidAmount = hexStrings[6] || '';

        return { propertyId, latitude, longitude, areaCity, state, ownerPublicAddress, defaultBidAmount };
    } catch (error) {
        console.error('Error fetching property details:', error);
        throw new Error('Failed to fetch property details');
    }
};

// Function to get property details using latitude and longitude
const getPropertyDetailsByLatLong = async (latitude: string, longitude: string) => {
    try {
        // const { data, error } = await supabase.from('transactions').select('txid');

        // console.log(supabase);
        const { data, error } = await supabase
            .from('transactions')  // Replace with your table name
            .select('txid, propertyId')
            .eq('latitude', latitude)
            .eq('longitude', longitude)
            .single();
        // console.log(data);

        if (error) {
            console.error('Error fetching transaction ID:', error.message);
            throw new Error('Failed to fetch transaction ID');
        }

        if (!data) {
            console.log('No transaction found for these coordinates');
            return null;
        }

        const { txid,propertyId } = data;
        const propertyDetails = await fetchPropertyDetailsFromTxid(txid,propertyId);
        return propertyDetails;
    } catch (error) {
        console.error('Error fetching property details by coordinates:', error);
        throw new Error('Failed to fetch property details by coordinates');
    }
};

export const load: Load = async ({ url }) => {
    const latitude = url.searchParams.get('latitude');
    const longitude = url.searchParams.get('longitude');
    // console.log(typeof latitude);
    // console.log(latitude);
    // console.log(longitude);

    if (!latitude || !longitude) {
        return { propertyDetails: null };
    }

    try {
        const propertyDetails = await getPropertyDetailsByLatLong(latitude, longitude);
        return { propertyDetails };
    } catch (error) {
        console.error('Error loading property details:', error);
        return { propertyDetails: null, error: 'Failed to load property details' };
    }
};
