// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/*
    Jeftar Mascarenhas
    twitter: @jeftar
    github: github.com/jeftarmascarenhas
    linkedin: linkedin.com/in/jeftarmascarenhas/
    site: jeftar.com.br
    youtube: youtube.com/@nftchoose
*/

// Smart contract is for my study and youtube channel. It isn't auditable.
// see the contract https://goerli.etherscan.io/address/0x51CBe51d66dFd14dE39f7312f27e746f716Ce96f#code
contract BoredApeYachFake is ERC721A, Ownable, Pausable {
    error ValueNotEnough(uint256 value);
    error MaxSupplyExcesseded(uint256 quantity);
    error MaxPerWallet(uint256 max);
    error FailedTransfer();

    event Withdrawn(address owner, uint256 value);

    // You can use this url https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/
    string private _baseTokenURI;
    uint256 public  _maxSupply = 100;
    uint256 public _pricePerToken = 0.0001 ether;
    uint256 constant public  _MAX_PER_WALLET = 2;

    mapping(address => uint256) public walletMinted;

    constructor(
        string memory uri_
    ) ERC721A("BoredApeYachFake", "BAYC") {
        _baseTokenURI = uri_;
    }

    function mint(uint256 quantity_) external payable whenNotPaused {
        if(totalSupply() + quantity_ > _maxSupply) {
            revert MaxSupplyExcesseded(totalSupply() + quantity_);
        }

        if(_pricePerToken * quantity_ > msg.value) {
            revert ValueNotEnough(msg.value);
        }

        if (walletMinted[msg.sender] >= _MAX_PER_WALLET || quantity_ > _MAX_PER_WALLET) {
           revert MaxPerWallet(_MAX_PER_WALLET);
        }

        _mint(msg.sender, quantity_);
        walletMinted[msg.sender] += quantity_;
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = msg.sender.call{value: balance}("");
        if(!success) {
            revert FailedTransfer();
        }
        emit Withdrawn(msg.sender, balance);
    }

    function setBaseURI(string calldata baseURI_) external onlyOwner {
        _baseTokenURI = baseURI_;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length != 0
                ? string(abi.encodePacked(baseURI, _toString(tokenId)))
                : "";
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setPricePerToken(uint newPrice_) external onlyOwner {
        _pricePerToken = newPrice_;
    }

    function setMaxSupply(uint newSupply_) external onlyOwner {
        _maxSupply = newSupply_;
    }

    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
}
