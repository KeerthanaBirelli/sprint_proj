<script lang="ts">
   import { storeTxid } from "./storeTxid";
 const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
  ];
  let selectedState = '';
  let propertyId = '';
  let latitude = '';
  let longitude = '';
  let areaCity = '';
  let ownerPublicAddress = '';
  let defaultBidAmount = '';
  let documents: File | null= null;
  let message = '';

  async function handleSubmit() {
    if (!documents) {
      message = 'Please select a document to upload.';
      return;
    }
     message = 'Deploying...........';

    // Upload document to IPFS
    const formData = new FormData();
    formData.append('file', documents);
    
    const metadata = JSON.stringify({ name: documents.name });
    const options = JSON.stringify({ cidVersion: 1 });
    formData.append('pinataMetadata', metadata);
    formData.append('pinataOptions', options);

      const form = new FormData();
      form.append('propertyId', propertyId);
      form.append('latitude', latitude);
      form.append('longitude', longitude);
      form.append('areaCity', areaCity);
      form.append('state', selectedState);
      form.append('ownerPublicAddress', ownerPublicAddress);
      form.append('defaultBidAmount', defaultBidAmount);
    //   form.append('documentUrl', documentHash);
      if (documents) {
      form.append('documents', documents);
    }


    try {
      const response = await fetch('?/deploy', {
        method: 'POST',
        body: form
      });
   
      const result = await response.json();
       const final: [object, boolean, string] = JSON.parse(result.data);
      if (final[1]) {
        message = `Smart contract deployed: https://whatsonchain.com/tx/`+final[2];

        await storeTxid(propertyId, final[2],latitude, longitude );
      
      } else {
        message = `Deployment failed: ${final[2]}`;
      }
    } catch (error) {
      console.error(error);
      message = 'Failed to upload document or deploy contract.';
    }
  }
</script>
<nav class="bg-gray-200 border-gray-200">
  <!-- <p>Issue New Property</p> -->
  <div class=" bg-gray-200 hidden w-full md:block md:w-auto" id="navbar-default">
    
        <ul class=" font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-200  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
          <li><p>Issue New Property</p></li>
          <li class="top-right">
            <a href="/dashboard" class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-400 md:p-0" aria-current="page">Go to dashboard</a>
          </li>
          
          
        </ul>
        </div>
</nav>
<div class="container">
  <div class="mt-10 pt-10 w-full max-w-xl p-12 mx-auto rounded-lg shadow-xl dark:bg-white/10 bg-white/30 ring-1 ring-gray-900/5 backdrop-blur-lg">
    <h1 class="text-2xl font-bold mb-8 text-center">Issue New Property</h1>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="propertyId">Property ID:</label>
        <input type="text" id="propertyId" bind:value={propertyId} />
      </div>
      <div class="form-group">
        <label for="latitude">Latitude:</label>
        <input type="text" id="latitude" bind:value={latitude} />
      </div>
      <div class="form-group">
        <label for="longitude">Longitude:</label>
        <input type="text" id="longitude" bind:value={longitude} />
      </div>
      <div class="form-group">
        <label for="areaCity">Area/City:</label>
        <input type="text" id="areaCity" bind:value={areaCity} />
      </div>
      <div class="form-group">
        <label for="stateSelected">Select your state:</label>
        <select id="stateSelected" bind:value={selectedState}>
          <option value="" disabled selected>Select a state</option>
          {#each states as stateSelected}
            <option value={stateSelected}>{stateSelected}</option>
          {/each}
        </select>
      </div>
      <div class="form-group owner-details">
        <label for="ownerPublicAddress">Owner Details:</label>
        <input type="text" id="ownerPublicAddress" bind:value={ownerPublicAddress} />
      </div>
      <div class="form-group">
        <label for="defaultBidAmount">Enter default bid amount:</label>
        <input type="number" id="defaultBidAmount" bind:value={defaultBidAmount} />
      </div>
      <div class="form-group">
        <label for="documents">Documents:</label>
        <input type="file" id="documents" on:change="{(e) => documents = e.target.files[0]}" />
      </div>
      <p class="small-light-text">Note: Size of the document should be less than 100KB.</p>
      <div class="button-container">
        <button type="submit">Submit</button>
      </div>
      {#if message}
        <p class="message">{message}</p>
      {/if}
    </form>
  </div>
</div>

<style>
  /* Your styles here */
  .container {
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: left;
    color: black;
  }

  .container h1 {
    text-align: center;
  }

  .form-group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 20px;
  }

  .form-group.owner-details {
    margin-bottom: 10px;
  }

  label {
    width: 150px;
    margin-right: 10px;
    color: black;
  }

  input, select {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    color: black;
  }

  .small-light-text {
    font-size: 0.8em;
    font-weight: 300;
    color: #666;
    margin-top: 0;
    text-align: center;
    margin-bottom: 20px;
  }

  .button-container {
    display: flex;
    justify-content: center;
  }

  button {
    width: 20%;
    padding: 10px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  .message {
    margin-top: 20px;
    color : #007bff
    /* color: rgb(46, 129, 217); */
  }
   .top-right {
    position: absolute;
    top: 0;
    right: 0;}
</style>