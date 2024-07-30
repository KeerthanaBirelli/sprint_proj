import { createClient } from '@supabase/supabase-js';
// const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseUrl = 'https://xkrknllhmcwyhtbbnnvp.supabase.co';
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
console.log(supabaseUrl);
console.log(supabaseKey);

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key are required');
}

const supabase = await createClient(supabaseUrl, supabaseKey);
console.log("client created....")
export async function storeTxid(propertyId: string, txid: string, latitude: string, longitude: string) {
    const { data, error } = await supabase
        .from('transactions')
        .insert([{ propertyId, txid, latitude, longitude }]);

    if (error) {
        console.error('Error storing txid in Supabase:', error);
        throw new Error('Failed to store txid');
    }

    return data;
}