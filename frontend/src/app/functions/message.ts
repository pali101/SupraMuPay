import {getProvider} from '../page';
import nacl from "tweetnacl";

const remove0xPrefix = (hexString: string) => {
    return hexString.startsWith("0x") ? hexString.slice(2) : hexString;
  }

export const signMessage = async (message: string): Promise<void> => {
    const provider = await getProvider();

    if (!provider) {
        throw new Error('Provider not found. Make sure the wallet is connected.');
    }
    try {
      const hexMessage = '0x' + Buffer.from(message, 'utf8').toString('hex');
      const response = await provider.signMessage({ message: hexMessage });
      console.log('signMessage response :: ', response);
      if (response) {
        const { publicKey, signature, address } = response;
        const sign = remove0xPrefix(signature);
        const key = remove0xPrefix(publicKey);
        const verified = nacl.sign.detached.verify(
          new TextEncoder().encode(message),
          Uint8Array.from(Buffer.from(sign, 'hex')),
          Uint8Array.from(Buffer.from(key, 'hex')),
        );
        console.log('signature :: ', signature);
        console.log('verified :: ', verified);
        console.log('publicKey :: ', publicKey);
        console.log('address :: ', address);
      } else {
        throw new Error('Failed to sign message.');
      }
    } catch (err) {
      console.error('Error signing message:', err);
      throw new Error('Failed to sign message.');
    }
  };