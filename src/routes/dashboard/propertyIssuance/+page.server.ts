import { Property } from "../../../contracts/property"; // Ensure this is the correct path to your contract
import { DefaultProvider, PubKeyHash, bsv, WhatsonchainProvider } from "scrypt-ts";
import { NeucronSigner } from "neucron-signer";
import axios from 'axios';
import type { RequestEvent } from '@sveltejs/kit';
// import artifact from "../../../artifacts/property.json";
// import { RateLimiterMemory } from 'rate-limiter-flexible'; 


const provider = new DefaultProvider({ network: bsv.Networks.mainnet });
// console.log(provider);
const signer = new NeucronSigner(provider);
// const limiter = new RateLimiterMemory({
//     points: 5,  
//     duration: 60 * 1000, 
// });

export const actions = {
    deploy: async ({ request }: RequestEvent) => {
        // Parse form data
        const data = await request.formData();
        // console.log(data)

        const propertyId = data.get("propertyId") as string;
        const latitude = data.get("latitude") as string;
        const longitude = data.get("longitude") as string;
        const areaCity = data.get("areaCity") as string;
        const stateSelected = data.get("state") as string;
        const ownerPublicAddress = data.get("ownerPublicAddress") as string;
        const defaultBidAmount = BigInt(data.get("defaultBidAmount") as string);
        const documentFile = data.get("documents") as File;
        if (!propertyId || !latitude || !longitude || !areaCity || !stateSelected || !ownerPublicAddress || !defaultBidAmount || !documentFile) {
            console.log('missing something');
            return { deployed: false, error: 'Missing required fields' };
        }
        // else {
        //     console.log('everything is there');
        // }

        // Prepare data for IPFS upload
        const formData = new FormData();
        formData.append('file', documentFile);

        const metadata = JSON.stringify({ name: documentFile.name });
        formData.append('pinataMetadata', metadata);

        const options = JSON.stringify({ cidVersion: 1 });
        formData.append('pinataOptions', options);

        const apiKey = import.meta.env.VITE_PINATA_API_KEY;
        const apiSecret = import.meta.env.VITE_PINATA_API_SECRET;

        let ipfsHash = '';
        try {
            // Upload document to IPFS
            const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'pinata_api_key': apiKey,
                    'pinata_secret_api_key': apiSecret,
                },
            });
            ipfsHash = response.data.IpfsHash;
        } catch (error) {
            console.error('IPFS upload failed:', error);
            return { deployed: false, txid: error.message };
        }

        // Construct document URL
        const documentUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
        // console.log(documentUrl);

        // try {
        //     await provider.connect();
        // } catch (error) {
        //     console.error('Failed to connect provider:', error);
        //     // return { deployed: false, txid: error.message };
        // }

        // // Debug: Log provider connection status
        // console.log('Provider connection status:', await provider.isConnected());
        
    
        // await signer.connect(provider);
        try {
            await signer.connect(provider);
        } catch (connectionError) {
            console.error('Failed to connect signer:', connectionError);
            // return { deployed: false, txid: connectionError.message };
        }
       

        // await signer.login('sales@timechainlabs.io', "string");
        
        await Property.loadArtifact();
    

        // Create and deploy smart contract
        // const instance = new Property(propertyId, latitude, longitude, areaCity, stateSelected, ownerPublicAddress as PubKeyHash, defaultBidAmount, documentUrl);
        const instance = new Property(
            Buffer.from(propertyId, 'utf8').toString('hex'),
            Buffer.from(latitude, 'utf8').toString('hex'),
            Buffer.from(longitude, 'utf8').toString('hex'),
            Buffer.from(areaCity, 'utf8').toString('hex'),
            Buffer.from(stateSelected, 'utf8').toString('hex'),
            ownerPublicAddress as PubKeyHash,
            defaultBidAmount,
            Buffer.from(documentUrl, 'utf8').toString('hex')
        );
        await instance.connect(signer);
        // const deployTx = await instance.deploy();

        try {
            // const result = await limiter.consume('login_rate_limiter');
            // if (!result) {
            //     throw new Error('Too many login attempts. Please wait.');
            // }
            // Login and deploy the contract
            await signer.login('sales@timechainlabs.io', "string");
            // await signer.login('keerthana.birelli@gmail.com', "Keerthi@3");
            const deployTx = await instance.deploy();
            console.log("Smart contract deployed: https://whatsonchain.com/tx/" + deployTx.id);
            return { deployed: true, txid: deployTx.id };
        } catch (error: any) {
            console.log(error.message)
            return { deployed: false, txid: error.message };
        }
    },
};

