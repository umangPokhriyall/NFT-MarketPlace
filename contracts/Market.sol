// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Marketplace is ReentrancyGuard {
    struct Listing {
        uint256 tokenId;
        address tokenAddress;
        address seller;
        uint256 price;
        string image;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public listingCounter;

    function listNFT(address tokenAddress, uint256 tokenId, uint256 price,string memory image) external nonReentrant {
        IERC721(tokenAddress).transferFrom(msg.sender, address(this), tokenId); 
        listings[listingCounter] = Listing(tokenId, tokenAddress, msg.sender, price,image); 
        listingCounter++;
    }

    function buyNFT(uint256 listingId) external payable nonReentrant {
        Listing memory listing = listings[listingId];
        require(msg.value == listing.price, "Incorrect price");

        delete listings[listingId]; 
        payable(listing.seller).transfer(msg.value); 
        IERC721(listing.tokenAddress).transferFrom(address(this), msg.sender, listing.tokenId); 
    }

    
}
