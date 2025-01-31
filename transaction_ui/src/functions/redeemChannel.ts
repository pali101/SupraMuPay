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

export async function redeemChannel(supraProvider: any,redeemHex: string,redeemHexHeight: number) {
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
    const functionInfo = '::micropayment_v2::get_last_channel_id';
    const moduleAddress = "0x47fdaf61c8ece1e2c788f9d0e192ae0832be69b4677b92020097548386f493ab";
    const channelId =await client.invokeViewMethod(moduleAddress+functionInfo,[],[]);
    console.log("channelId",channelId);
    const rawTxPayload = [
      accounts[0],
      sequenceNumber.toString(),
      // "0x4af78119e05ddb18513db574d3a76e820d5e1d2e8a6b65105bf96216f095e1c9",
      moduleAddress,
      "micropayment_v2",
      "redeem_channel",
      [],
      [
        BCS.bcsSerializeBytes(hexToBytes(redeemHex)),
        BCS.bcsSerializeUint64(redeemHexHeight),
        BCS.bcsSerializeUint64(channelId),
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