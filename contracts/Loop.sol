// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Loop {
    function loop() public pure returns (uint256, uint256) {
        uint256 i;
        for (i = 0; i < 100; i++) {
            if (i == 3) {
                break;
            }
        }

        uint256 j;
        while (j < 5) {
            j++;
        }

        return (i, j);
    }
}
