
import * as anchor from "@project-serum/anchor";
import bs58 from "bs58";
import { Annotation } from "../models/Annotation";
import {PublicKey} from '@solana/web3.js';
import _ from "lodash";

type GetProps = {
    program: anchor.Program<anchor.Idl>;
    filter?: unknown[];
    listPubKeys?: PublicKey[];
    pubKey?: PublicKey;
    topicPubKey?: PublicKey
};

export const fetchAnnotations = async ({ program, filter = [] }: GetProps) => {
    
    const annotationRaw = await program.account.annotation.all(filter as any);
    console.log("annotationRaw", annotationRaw);
    const annotation = annotationRaw.map((t: any) => new Annotation(t.publicKey, t.account));
    return annotation
} 

  export const fetchMultipleAnnotations = async ({ program, listPubKeys = [], filter = [] }: GetProps) => {
      
    let annotationRaw;
    if (filter.length) {
        console.log("FILTERING ANNOTATION : ", filter);
        annotationRaw = await program.account.annotation.all(filter as any);
    }
    else {
        console.log("FETCHING MULTIPLE ANNOTATION : ", listPubKeys);
        annotationRaw = await program.account.annotation.fetchMultiple(listPubKeys);
    }
    console.log("multiple Parent Annotations ", annotationRaw);
    const annotationObj = annotationRaw.map((t: any, i:number) => new Annotation(filter.length ? t.publicKey : listPubKeys[i], filter.length ? t.account : t));
    return filter.length ? annotationObj :  _.keyBy(annotationObj, o => o.publicKey.toBase58());
    // return annotation
    

    // const annotation = new Map(annotationRaw.map((t: any, i:number) => [listPubKeys[i], new Annotation(listPubKeys[i], t)]));
    
} 

export const annotationTopicFilter = (topicBase58PublicKey: string) => ({
    memcmp: {
      offset:
        8 + // Discriminator.
        32 + // Author public key.
        32, // Parent Annotation
      bytes: topicBase58PublicKey,
    },
  });

  export const annotationAuthorFilter = (authorBase58PublicKey: string) => ({
    memcmp: {
      offset:
        8, // Discriminator.
      bytes: authorBase58PublicKey,
    },
  });

  export const parentAnnotationFilter = (topicBase58PublicKey: string) => ({
    memcmp: {
      offset:
        8 + // Discriminator.
        32, // Author public key.
      bytes: topicBase58PublicKey,
    },
  });




export default fetchAnnotations;