<script lang="ts">
  // import { onMount } from 'svelte';
  import axios from 'axios';

  let file: File | null = null;
  let message: string = '';

  const uploadFile = async () => {
    if (!file) {
      message = 'Please select a file to upload.';
      return;
    }

    const apiKey = import.meta.env.VITE_PINATA_API_KEY;
    const apiSecret = import.meta.env.VITE_PINATA_API_SECRET;

    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', options);

    try {
      const response = await axios.post(url, formData, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data`,
          'pinata_api_key': apiKey,
          'pinata_secret_api_key': apiSecret,
        },
      });
      console.log(response.data);
      message = `File uploaded successfully: ${response.data.IpfsHash}`;
    } catch (error) {
      console.error(error);
      message = 'Failed to upload file.';
    }
  };
</script>

<style>
  .upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  input[type="file"] {
    margin: 10px;
  }

  button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  p {
    margin-top: 20px;
    color: red;
  }
</style>

<div class="upload-container">
  <h1>Upload Document</h1>
  <input type="file" on:change="{(e) => file = e.target.files[0]}" />
  <button on:click="{uploadFile}">Upload</button>
  {#if message}
    <p>{message}</p>
  {/if}
</div>


