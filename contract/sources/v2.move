module self::micropayment_v2{
    use std::signer;
    use std::vector;
    use std::hash;
    use std::string::{Self, String};
    use supra_framework::supra_coin::SupraCoin;
    use supra_framework::coin::{Self, Coin};
    use aptos_std::table::{Self, Table};
    use supra_framework::account::{Self, SignerCapability};

    const MODULE_OWNER:address = @self;

    const ENO_SAME_SENDER_RECEIVER:u64 = 0;
    const ENO_NOT_MODULE_OWNER:u64 = 1;
    const E_CHANNEL_ALREADY_REDEEMED:u64 = 2;
    const E_NOT_RECEIVER: u64 = 3;
    const E_INVALID_TOKEN: u64 = 4;
    const E_CHANNEL_DOESNT_EXIST: u64 = 5;

    struct Channel has store, drop, key{
        channel_id: u64,
        sender_address: address,
        receiver_address: address,
        initial_amount: u64,
        total_tokens: u64,
        redeemed: bool,
        trust_anchor: vector<u8>,
    }

    struct SignerCapabilityStore has key{
        signer_cap: SignerCapability
    }

    struct GlobalTable has key {
        channel_table: Table<u64, Channel>,
        channel_counter:u64,
    }

    public entry fun init_deploy(deployer: &signer) {
        assert!(signer::address_of(deployer) == MODULE_OWNER, ENO_NOT_MODULE_OWNER);

        // Create a resource account and retrieve its signer capability
        let (_resource, signer_cap) = account::create_resource_account(deployer, vector::empty());

        // Create a signer using the retrieved signer capability
        let rsrc_acc_signer = account::create_signer_with_capability(&signer_cap);

        coin::register<SupraCoin>(&rsrc_acc_signer);

         // Move the GlobalTable resource to the deployer's account
        move_to(deployer, GlobalTable {
            // Initialize a table to store channel details
            channel_table: table::new(),
            channel_counter: 0,
        });

        // Move the SignerCapabilityStore resource to the deployer's account
        move_to(deployer, SignerCapabilityStore{
            signer_cap
        });
    }

    public entry fun create_channel (sender: &signer, receiver_address: address, initial_amount: u64, total_tokens: u64, trust_anchor: vector<u8>) acquires GlobalTable, SignerCapabilityStore {
       // Get the sender's address
       let sender_address = signer::address_of(sender);

       // Access the global table resource
        let global_table_resource = borrow_global_mut<GlobalTable>(MODULE_OWNER);

        // Increment the channel counter
        let counter = global_table_resource.channel_counter + 1;

        // Ensure the sender and receiver are not the same
        assert!(sender_address != receiver_address, ENO_SAME_SENDER_RECEIVER);

        // MOST IMPORTANT - take payment from sender and transfer to contract

        // Access the resource account signer capability
        let signer_cap_resource = borrow_global_mut<SignerCapabilityStore>(MODULE_OWNER);
        let rsrc_acc_signer = account::create_signer_with_capability(&signer_cap_resource.signer_cap);
        let rsrc_acc_address = signer::address_of(&rsrc_acc_signer);

        // Transfer initial amount from sender to resource account
        coin::transfer<SupraCoin>(sender, rsrc_acc_address, initial_amount);

        // assert!(self::channel_exists(sender_address, receiver_address) == false, "channel already exists");
         // Create the new channel
        let new_channel = Channel {
            channel_id: counter,
            sender_address: sender_address,
            receiver_address: receiver_address,
            initial_amount: initial_amount,
            total_tokens: total_tokens,
            trust_anchor: trust_anchor,
            redeemed: false,
        };
        // self::set_channel(sender_address, receiver_address, channel);
        // Insert the new channel into the table
        table::upsert(&mut global_table_resource.channel_table, counter, new_channel);

        // Update the channel counter
        global_table_resource.channel_counter = counter;
    }

    public entry fun redeem_channel (receiver: &signer, final_token: vector<u8>, no_of_tokens: u64, channel_id: u64) acquires GlobalTable, SignerCapabilityStore {

        // Access the global table resource
        let global_table_resource = borrow_global_mut<GlobalTable>(MODULE_OWNER);

        // Ensure the channel exists
        assert!(channel_id > global_table_resource.channel_counter, E_CHANNEL_DOESNT_EXIST);

        // Borrow the channel from the table
        let channel = table::borrow_mut(&mut global_table_resource.channel_table, channel_id);

        // Ensure the channel is not already redeemed
        assert!(channel.redeemed == false, E_CHANNEL_ALREADY_REDEEMED);

         // Get the receiver's address and validate it matches the channel's receiver
        let receiver_address = signer::address_of(receiver);
        assert!(channel.receiver_address == receiver_address, E_NOT_RECEIVER);

        // Retrieve channel details
        let total_tokens = channel.total_tokens;
        let initial_amount = channel.initial_amount;
        let trust_anchor_vec = channel.trust_anchor;

        // Get the resource account signer capability
        let signer_cap_resource = borrow_global_mut<SignerCapabilityStore>(MODULE_OWNER);
        let (rsrc_acc_signer,  _rsrc_acc_address) = get_rsrc_acc(signer_cap_resource);
 
        // let rsrc_acc_signer = account::create_signer_with_capability(&signer_cap_resource.signer_cap);
        // let rsrc_acc_address = signer::address_of(&rsrc_acc_signer);


        // let hash = calculate_hash(final_token, channel.trust_anchor, no_of_tokens, channel_id);
        // let input = *std::string::bytes(&final_token);

        // Initialize hash calculation
        let input = final_token;
        let hash_value = hash::sha3_256(input);
        let num = no_of_tokens;

        // Perform hash iterations
        while (num > 0) {
            hash_value = hash::sha3_256(input);
            num = num - 1;
            input = hash_value;
        };

        // Validate the hash against the trust anchor
        if(hash_value == trust_anchor_vec){
            // Calculate receiver and sender amounts
            let receiver_amount = (no_of_tokens * initial_amount)/total_tokens; 
            let sender_amount = initial_amount - receiver_amount;
            // Get resource account - get_rsrc_account(): (signer, address)

            // Transfer amounts to receiver and sender
            coin::transfer<SupraCoin>(&rsrc_acc_signer, channel.receiver_address, receiver_amount);
            coin::transfer<SupraCoin>(&rsrc_acc_signer, channel.sender_address, sender_amount);

            // Mark the channel as redeemed
            channel.redeemed = true;
        }
        else{
            // Handle invalid token case
            assert!(false, E_INVALID_TOKEN);
            channel.redeemed = false;
        }
    }

    fun get_rsrc_acc(signer_cap_resource: &SignerCapabilityStore): (signer, address) {
        let rsrc_acc_signer = account::create_signer_with_capability(&signer_cap_resource.signer_cap);
        let rsrc_acc_addr = signer::address_of(&rsrc_acc_signer);

        (rsrc_acc_signer, rsrc_acc_addr)
    }

    #[view]
    public fun get_last_channel_id():u64 acquires GlobalTable {
        let global_table_resource = borrow_global_mut<GlobalTable>(MODULE_OWNER);
        global_table_resource.channel_counter
    }
}