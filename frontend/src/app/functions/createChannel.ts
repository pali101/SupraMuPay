'use client';
import { HexString, BCS, SupraClient } from 'supra-l1-sdk';

export function hexToBytes(hex: string): Uint8Array {
  return new Uint8Array(hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) ?? []);
}

export async function getClient() {
  let url = "https://rpc-testnet.supra.com/";
  let supraClient = await SupraClient.init(url);  
  console.log("Connected to Supra client:");
  return supraClient;
}

export async function createChannel(supraProvider: any,merchantAddress: string,amount:number,totalChannelAmount:number,trustAnchor: string) {
  try {
    if (!supraProvider) {
      alert('StarKey wallet not found');
      return;
    }
    const accounts = await supraProvider.account();
    if (!accounts.length) {
      alert('Please connect your wallet first');
      return;
    }

    const txExpiryTime = Math.ceil(Date.now() / 1000) + 30;
    const optionalTransactionPayloadArgs = { txExpiryTime };
    const client = await getClient();
    const sequenceNumber = (await client.getAccountInfo(accounts[0])).sequence_number;

    const rawTxPayload = [
      accounts[0],
      sequenceNumber.toString(),
      "0x4af78119e05ddb18513db574d3a76e820d5e1d2e8a6b65105bf96216f095e1c9",
      "micropayment_v2",
      "create_channel",
      [],
      [
        new HexString(merchantAddress).toUint8Array(),
        BCS.bcsSerializeUint64((amount * 100000000)),
        BCS.bcsSerializeUint64(totalChannelAmount),
        BCS.bcsSerializeBytes(hexToBytes(trustAnchor)),
      ],
      optionalTransactionPayloadArgs
    ];

    const data = await supraProvider.createRawTransactionData(rawTxPayload);
    if (data) {
      const networkData = await supraProvider.getChainId();
      const params = {
        data,
        from: accounts[0],
        to: "0xd25f78655f32e2534dfc26fc45391c5e3b3ccd82ce7f3992b76ef7d01b474a55",
        chainId: networkData.chainId,
        value: "",
      };
      return await supraProvider.sendTransaction(params);
    }
  } catch (error) {
    console.error('Create Channel Transaction failed:', error);
    throw error;
  }
}