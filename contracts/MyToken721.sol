//SPDX-License-Identifier:MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract MyToken721 is ERC721
{    uint256 public _currentTokenId = 0;
    constructor () ERC721("Geetanjali","MTk"){}
      

       function mint(address to) external{
        _currentTokenId++;
        _mint(to, _currentTokenId);
    }
    function _baseURI() internal pure override returns (string memory) {
        return "https://www.GeetanjaliSingh.com";
        }

        function safeMint(address to ,uint256 tokenId)public 
        {
            _safeMint(to,tokenId);
        }

                // Since OwnerOf function is internal so we are using it in derived contract to do testing.
        function testOwnerOf(uint256 tokenId) external view returns (address) {
            return _ownerOf(tokenId);
}

        function getApprovedOf(uint256 tokenId) external view returns (address) {
        return _getApproved(tokenId);
    }

      function isAuthorizedOf(address owner, address spender, uint256 tokenId) external view returns (bool) {
        return
            spender != address(0) &&
            (owner == spender || isApprovedForAll(owner, spender) || _getApproved(tokenId) == spender);
}

     function increaseBalanceOf(address account, uint128 value) public {
        
            _increaseBalance(account,value);
        }

        function updateOf(address to, uint256 tokenId, address auth) public {
            _update(to,tokenId,auth);
        }

               function burnOf(uint256 tokenId) public {
                 _burn(tokenId);
                 
        }

        function approveOf(address to, uint256 tokenId, address auth, bool emitEvent)public{
            _approve(to,tokenId,auth,emitEvent);
        }


         function requireOwnedOf(uint256 tokenId) external view returns(address) {
                address owner = _ownerOf(tokenId);
                if (owner == address(0)) {
                    revert ERC721NonexistentToken(tokenId);
                }
                return owner;
    }
}

    //   function checkOnERC721ReceivedOf(address from, address to, uint256 tokenId, bytes memory data) private {
    //     if (to.code.length > 0) {
    //         try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, data) returns (bytes4 retval) {
    //             if (retval != IERC721Receiver.onERC721Received.selector) {
    //                 revert("ERC721InvalidReceiver: invalid ERC721 receiver");
    //             }
    //         } catch (bytes memory reason) {
    //             if (reason.length == 0) {
    //                 revert("ERC721InvalidReceiver: failed to call onERC721Received");
    //             } else {
    //                 /// @solidity memory-safe-assembly
    //                 assembly {
    //                     revert(add(32, reason), mload(reason))
    //                 }

    //             }
//             }
//         }
//       }

