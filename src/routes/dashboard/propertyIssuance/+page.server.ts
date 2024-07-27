import { Property } from "../../../contracts/property"; 
import { DefaultProvider, PubKeyHash, bsv, WhatsonchainProvider } from "scrypt-ts";
import { NeucronSigner } from "neucron-signer";
import axios from 'axios';
import type { RequestEvent } from '@sveltejs/kit';

const provider = new DefaultProvider({ network: bsv.Networks.mainnet });
// console.log("outside:",provider);
const signer = new NeucronSigner(provider);

const parseFormData = async (requestEvent: RequestEvent) => {
    const data = await requestEvent.request.formData();
    return {
        propertyId: data.get("propertyId") as string,
        latitude: data.get("latitude") as string,
        longitude: data.get("longitude") as string,
        areaCity: data.get("areaCity") as string,
        stateSelected: data.get("state") as string,
        ownerPublicAddress: PubKeyHash(data.get("ownerPublicAddress") as string),
        defaultBidAmount: BigInt(data.get("defaultBidAmount") as string),
        documentFile: data.get("documents") as File
    };
};

const uploadToIPFS = async (documentFile: File) => {
    const formData = new FormData();
    formData.append('file', documentFile);
    const metadata = JSON.stringify({ name: documentFile.name });
    formData.append('pinataMetadata', metadata);
    const options = JSON.stringify({ cidVersion: 1 });
    formData.append('pinataOptions', options);

    const apiKey = import.meta.env.VITE_PINATA_API_KEY;
    const apiSecret = import.meta.env.VITE_PINATA_API_SECRET;

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
            'Content-Type': 'multipart/form-data',
            'pinata_api_key': apiKey,
            'pinata_secret_api_key': apiSecret,
        },
    });

    return response.data.IpfsHash;
};

const connectSigner = async () => {
    try {
        // console.log("inside:", provider);

        // await signer.connect(provider);
        // console.log("inside:", provider);
        await signer.login('sales@timechainlabs.io', "string");
        // console.log("Signer connected and logged in");
    } catch (error) {
        console.error('Failed to connect signer:', error);
        throw new Error('NeucronSigner connection failed');
    }
};

const deployContract = async (
    propertyId: string,
    latitude: string,
    longitude: string,
    areaCity: string,
    stateSelected: string,
    ownerPublicAddress: PubKeyHash,
    defaultBidAmount: bigint,
    documentUrl: string
) => {
    await Property.loadArtifact();

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
    const deployTx = await instance.deploy();
    console.log("Smart contract deployed: https://whatsonchain.com/tx/" + deployTx.id);

    return deployTx.id;
};

export const actions = {
    deploy: async (event : RequestEvent) => {
        try {
            const formData = await parseFormData(event);
            const { propertyId, latitude, longitude, areaCity, stateSelected, ownerPublicAddress, defaultBidAmount, documentFile } = formData;

            if (!propertyId || !latitude || !longitude || !areaCity || !stateSelected || !ownerPublicAddress || !defaultBidAmount || !documentFile) {
                console.log('missing something');
                return { deployed: false, error: 'Missing required fields' };
            }

            const ipfsHash = await uploadToIPFS(documentFile);
            // console.log("ipfshash:",ipfsHash);
            const documentUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
            // try {
            //     await signer.connect(provider);
            // } catch (connectionError) {
            //     console.error('Failed to connect signer:', connectionError);
            //     // return { deployed: false, txid: connectionError.message };
            // }

            console.log("connect signer og:",await connectSigner());
           
            const txid = await deployContract(propertyId, latitude, longitude, areaCity, stateSelected, ownerPublicAddress, defaultBidAmount, documentUrl);
            console.log(txid);
            return { deployed: true, txid };

        } catch (error) {
            console.error('Deployment failed:', error);
            // return { deployed: true, txid };
            return { deployed: false, error };
        }
    },
};
