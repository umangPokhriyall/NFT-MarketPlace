    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.0;

    import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
    // import "@openzeppelin/contracts/access/Ownable.sol";

    contract MyNFT is ERC721URIStorage{
        uint256 private _currentTokenId;

        constructor() ERC721("NewToken", "NT")  {
            _currentTokenId = 0;
        }
        
        function mintNFT(address recipient, string memory tokenURI)
            public
            returns (uint256)
        {
            _currentTokenId++;

            uint256 newItemId = _currentTokenId;
            _mint(recipient, newItemId);
            _setTokenURI(newItemId, tokenURI);
            return newItemId;
        }

    }
