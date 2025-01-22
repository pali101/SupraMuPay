import hashlib


def sha3_256(data: bytes) -> bytes:
    """
    Computes the SHA3-256 hash of the given data (raw bytes)
    and returns the result as raw bytes.
    """
    return hashlib.sha3_256(data).digest()  # Return raw bytes, not hex string


def hash_seed(seed: str, num_hashes: int) -> str:
    """
    Hashes the 'seed' multiple times using SHA3-256, showing each step.

    :param seed: Input seed as a *string* (e.g. "hello" or "0xabc...").
                 Note this is taken literally and will be UTF-8-encoded.
    :param num_hashes: Number of total hashes you want in the chain
    :return: The final SHA3-256 hash, returned as a hex string (for convenience).
    """

    # Convert the seed string to raw bytes (UTF-8).
    # seed_bytes = seed.encode("utf-8")

    # 1) Compute h1 = h(seed)
    hash_value = sha3_256(seed_bytes)
    # print(f"Hash 1: {hash_value.hex()}")

    # 2) For i in [2..num_hashes], compute h_{i} = h(h_{i-1})
    for i in range(2, num_hashes + 1):
        hash_value = sha3_256(hash_value)
        print(f"Hash {i}:  {hash_value.hex()}")

    # Return the final hash as a hex string
    return hash_value.hex()


if __name__ == "__main__":
    seed = "Random seed"
    seed_bytes = seed.encode("utf-8")
    num_hashes = 50
    final_hash = hash_seed(seed_bytes, num_hashes)
    # print(f"Final hash: {final_hash}")

    # print()

    # seed_bytes2 = bytes.fromhex(
    #     "0ded7936f8b0523cf9b4b08d86f7f01dfe796ecf31da90b7f9f5de00a281fa9f"
    # )
    # num_hashes -= 1
    # final_hash2 = hash_seed(seed_bytes2, num_hashes)
    # print(f"Final hash: {final_hash}")
