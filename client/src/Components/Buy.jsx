import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Buy = ({ web3, account, nft, market }) => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bought, setBought] = useState(false);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const listingCount = await market.methods.listingCounter().call();
                const tempListings = [];
                for (let i = 0; i < listingCount; i++) {
                    const listing = await market.methods.listings(i).call();
                    tempListings.push({
                        tokenId: listing.tokenId.toString(),
                        price: web3.utils.fromWei(listing.price, 'ether'),
                        seller: listing.seller,
                        image: listing.image
                    });
                }
                setListings(tempListings);
            } catch (error) {
                console.error("Error fetching listings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [market, web3, bought]);

    const handleBuy = async (index, price) => {
        try {
            await market.methods.buyNFT(index).send({ from: account, value: web3.utils.toWei(price, 'ether') });
            setBought(!bought);
        } catch (error) {
            console.error("Error buying NFT:", error);
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            <h1 className="text-2xl font-bold mb-4">Available Listings</h1>
            {loading ? (
                <p>Loading listings...</p>
            ) : listings.length === 0 ? (
                <p>No listings available.</p>
            ) : (
                listings.map((listing, index) => (
                    listing.seller !== "0x0000000000000000000000000000000000000000" && (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2">Token ID: {listing.tokenId}</h2>
                            <img src={listing.image} alt="img" />
                            <p className="text-gray-700 mb-2">Seller: {listing.seller}</p>
                            <p className="text-gray-900 text-lg font-bold mb-2">Price: {listing.price} ETH</p>
                            {account.toLowerCase() === listing.seller.toLowerCase() ? (
                                <button className="bg-green-500 text-white py-2 px-4 rounded" disabled>
                                    Owned
                                </button>
                            ) : (
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                    onClick={() => handleBuy(index, listing.price)}
                                >
                                    Buy
                                </button>
                            )}
                        </div>
                    )
                ))
            )}
        </div>
    );
};

Buy.propTypes = {
    web3: PropTypes.object.isRequired,
    account: PropTypes.string.isRequired,
    nft: PropTypes.object.isRequired,
    market: PropTypes.object.isRequired,
};

export default Buy;
