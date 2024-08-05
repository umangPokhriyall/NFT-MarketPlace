import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Create = ({ web3, account, nft, market }) => {
  const JWT = "your new JWT token";
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  const uploadToIPFS = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        console.log("Using JWT token:", JWT); 
        const response = await fetch(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${JWT}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const ImgHash = `https://ipfs.io/ipfs/${result.IpfsHash}`;
        setImage(ImgHash);
      } catch (e) {
        console.error("Upload to Pinata failed", e);
        alert("Unable to upload image to Pinata.");
      }
    }
  };

  const uploadMetadata = async (e) => {
    e.preventDefault();
    if (!image || !price || !name || !description) return;
    try {
      const metadata = JSON.stringify({ image, price, name, description });
      const formData = new FormData();
      formData.append("file", new Blob([metadata], { type: "application/json" }), "metadata.json");

      console.log("Using JWT token:", JWT); 
      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      const metadataURI = `https://ipfs.io/ipfs/${result.IpfsHash}`;
      console.log("Metadata URI:", metadataURI);
      mintNFT(metadataURI);
    } catch (error) {
      console.log("IPFS metadata upload error:", error);
    }
  };

  const mintNFT = async (metadataURI) => {
    try {
      const result = await nft.methods.mintNFT(account, metadataURI).send({ from: account });
      const tokenId = result.events.Transfer.returnValues.tokenId;
      await nft.methods.approve(market.options.address, tokenId).send({ from: account });
      await market.methods.listNFT(nft.options.address, tokenId, web3.utils.toWei(price, 'ether'),image).send({ from: account });
      alert(`Listed NFT with ID ${tokenId}`);
    } catch (error) {
      console.error("Error minting and listing NFT:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-4 rounded shadow-md w-full max-w-sm" onSubmit={uploadMetadata}>
        <div className="mb-4">
          <input
            type="file"
            id="fileInput"
            className="border rounded w-full py-2 px-3"
            onChange={uploadToIPFS}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            id="input1"
            placeholder='Name'
            className="border rounded w-full py-2 px-3"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            id="input2"
            placeholder='Description'
            className="border rounded w-full py-2 px-3"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            id="input3"
            placeholder='Price'
            className="border rounded w-full py-2 px-3"
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

Create.propTypes = {
  web3: PropTypes.object.isRequired,
  account: PropTypes.string.isRequired,
  nft: PropTypes.object.isRequired,
  market: PropTypes.object.isRequired,
};

export default Create;
