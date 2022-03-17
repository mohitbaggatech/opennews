import { Wallet, web3 } from '@project-serum/anchor'
import { Topic } from '../models/Topic'
import * as anchor from "@project-serum/anchor";

// 1. Define the sendTopic endpoint.
export const addTopic = async (topic_string : string, tag_string : string, wallet: any, program: any) => {

    if (program) {
  	// 2. Generate a new Keypair for our new topic account.
    const topic = web3.Keypair.generate()

    // 3. Send a "addTopic" instruction with the right data and the right accounts.
    await program.rpc.addTopic(topic_string, tag_string, {
        accounts: {
            author: wallet.publicKey,
            topic: topic.publicKey,
            systemProgram: web3.SystemProgram.programId,
        },
        signers: [topic]
    })

    
    // 4. Fetch the newly created account from the blockchain.
    // const topicAccount = await program.account.topic.fetch(topic.publicKey)
    
    // 5. Wrap the fetched account in a Topic model so our frontend can display it.
    return new Topic(topic.publicKey, {
        topic: topic_string, 
        tag: tag_string,
        timestamp: new anchor.BN(Date.now() / 1000 | 0),
        allegations: 0,
        support: 0,
        against: 0,
        author : wallet.publicKey,
    });
    }

}


