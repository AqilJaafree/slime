// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PYUSDOFT is OFT {
    constructor(
        address _lzEndpoint,
        address _owner
    ) OFT("PayPal USD", "PYUSD", _lzEndpoint, _owner) Ownable(_owner) {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function sharedDecimals() public pure override returns (uint8) {
        return 6;
    }
}