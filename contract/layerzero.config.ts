import { EndpointId } from '@layerzerolabs/lz-definitions';
import type { OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat';
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities';

// Define the contracts
const sepoliaContract: OmniPointHardhat = {
  eid: EndpointId.SEPOLIA_V2_TESTNET, // 40161
  contractName: 'PYUSDAdapter',
  address: '0xbCa138bDcAF118519d26D631eD628c2b3Ce41C8E',
};

const hederaContract: OmniPointHardhat = {
  eid: 40285, // Hedera Testnet EID
  contractName: 'PYUSDOFT',
  address: '0x6a87032589b837935b1a393dc905c84e908c6974',
};

// Enforced options for gas
const enforcedOptions = [
  {
    msgType: 1,
    optionType: ExecutorOptionType.LZ_RECEIVE,
    gas: 200000, // Gas for lzReceive on destination
    value: 0,
  },
];

export default {
  contracts: [
    { contract: sepoliaContract },
    { contract: hederaContract },
  ],
  connections: [
    {
      from: sepoliaContract,
      to: hederaContract,
      config: {
        sendConfig: {
          executorConfig: {
            maxMessageSize: 10000,
            executor: '0x718B92b5CB0a5552039B593faF724D182A881eDA', // Sepolia Executor
          },
          ulnConfig: {
            confirmations: 5,
            requiredDVNs: [
              '0x8eebf8b423B73bFCa51a1Db4B7354AA0bFCA9193', // LayerZero Labs DVN on Sepolia
            ],
            optionalDVNs: [],
            optionalDVNThreshold: 0,
          },
        },
        receiveConfig: {
          ulnConfig: {
            confirmations: 5,
            requiredDVNs: [
              '0x8eebf8b423B73bFCa51a1Db4B7354AA0bFCA9193', // LayerZero Labs DVN (placeholder - needs Hedera address)
            ],
            optionalDVNs: [],
            optionalDVNThreshold: 0,
          },
        },
        enforcedOptions: enforcedOptions,
      },
    },
  ],
};