import { Wallet, web3 } from '@project-serum/anchor'
import { Annotation } from '../models/Annotation'
import * as anchor from "@project-serum/anchor";

// 1. Define the sendTopic endpoint.
export const addAnnotation = async (url : string, annotation : string,
    annotation_type: number, topic: string | string[], parent_annotation: any,
    wallet: any, program: any) => {

        console.log(":::::::: ADD ANNOTATION :::::   ", url, annotation, annotation_type, topic, parent_annotation, wallet, program);

    if (program && wallet) {
  	// 2. Generate a new Keypair for our new topic account.
    const annotation_key = web3.Keypair.generate();

    // 3. Send a "addAnnotation" instruction with the right data and the right accounts.
    const req = await program.rpc.addAnnotation(annotation, url, annotation_type, {
        accounts: {
            author: wallet.publicKey,
            parentTopic: topic,
            annotation: annotation_key.publicKey,
            systemProgram: web3.SystemProgram.programId,
        },
        signers: [annotation_key],
        remainingAccounts: parent_annotation ? [{
            isSigner: false,
            isWritable: true,
            pubkey: parent_annotation.publicKey
        }] : []
    });

    console.log(req);
    
    // 4. Fetch the newly created account from the blockchain.
    // const topicAccount = await program.account.topic.fetch(topic.publicKey)
    
    // 5. Wrap the fetched account in a Topic model so our frontend can display it.
    return new Annotation(annotation_key.publicKey, 
        {'author' : wallet.publicKey,
        'timestamp': new anchor.BN(Date.now() / 1000 | 0),
        'parentTopic': new anchor.web3.PublicKey(topic),
        'parent': parent_annotation ? parent_annotation.publicKey : undefined,
        'allegations': 0,
        'support': 0,
        'against': 0,
        'annotation': annotation,
        'uri': url,
        'old_annotation': undefined,
        'isEdited': 0,
        'editedOn': undefined,
        'edited': undefined,
        'snippetType': annotation_type});
    }

}




export const editAnnotation = async (url : string, annotation : string,
    annotation_type: number, topic: string | string[], parent_annotation: any,
    old_annotation: any, wallet: any, program: any) => {

    console.log(":::::::: EDIT ANNOTATION :::::   ", url, annotation, annotation_type, topic, parent_annotation, old_annotation, wallet, program);
    
    if (program && wallet) {
  	// 2. Generate a new Keypair for our new topic account.
    const annotation_key = web3.Keypair.generate();

    // 3. Send a "addAnnotation" instruction with the right data and the right accounts.
    const req = await program.rpc.editAnnotation(annotation, url, annotation_type, {
        accounts: {
            author: wallet.publicKey,
            parentTopic: topic,
            annotation: annotation_key.publicKey,
            oldAnnotation: old_annotation,
            systemProgram: web3.SystemProgram.programId,
        },
        signers: [annotation_key],
        remainingAccounts: parent_annotation ? [{
            isSigner: false,
            isWritable: true,
            pubkey: parent_annotation
        }] : []
    });

    console.log(req);
    
    // 4. Fetch the newly created account from the blockchain.
    // const topicAccount = await program.account.topic.fetch(topic.publicKey)
    
    // 5. Wrap the fetched account in a Topic model so our frontend can display it.
    return new Annotation(annotation_key.publicKey, 
        {'author' : wallet.publicKey,
        'timestamp': new anchor.BN(Date.now() / 1000 | 0),
        'parentTopic': new anchor.web3.PublicKey(topic),
        'parent': parent_annotation ? parent_annotation.publicKey : undefined,
        'allegations': 0,
        'support': 0,
        'against': 0,
        'annotation': annotation,
        'uri': url,
        'isEdited': 0,
        'editedOn': undefined,
        'edited': undefined,
        'old_annotation': old_annotation,
        'snippetType': annotation_type});
    }

}


