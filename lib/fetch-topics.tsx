
import * as anchor from "@project-serum/anchor";
import bs58 from "bs58";
import { Topic } from "../models/Topic";
import {PublicKey} from '@solana/web3.js';
import _ from "lodash";

type GetProps = {
    program: anchor.Program<anchor.Idl>;
    filter?: unknown[];
    listPubKeys?: PublicKey[];
    pubKey?: PublicKey;
};

export const fetchTopics = async ({ program, filter = [] }: GetProps) => {
    const topicsRaw = await program.account.topic.all(filter as any);
    console.log("topicsRaw", topicsRaw);
    const topics = topicsRaw.map((t: any) => new Topic(t.publicKey, t.account));
    return topics
}

export const fetchTopicDetail = async ({ program, pubKey }: GetProps) => {
  if (pubKey) {
    const topicsRaw = await program.account.topic.fetch(pubKey);
  console.log("Topic Details", topicsRaw);
  const topic = new Topic(pubKey, topicsRaw);
  return topic
  }
}

export const fetchMultipleTopics = async ({ program, listPubKeys = [] }: GetProps) => {

    const topicsRaw = await program.account.topic.fetchMultiple(listPubKeys);
    console.log("multiple Topics ", topicsRaw);
    const topicsObj = topicsRaw.map((t: any, i:number) => new Topic(listPubKeys[i], t));
    const topics = _.keyBy(topicsObj, o => o.publicKey.toBase58());
    return topics
  };

export const topicFilter = (tag: string) => ({
    memcmp: {
      offset:
        8 + // Discriminator.
        32 + // Author public key.
        8 + // Timestamp.
        3 + // 3 Stats - Allegation, Support, Against
        4, // Tag string prefix.
      bytes: bs58.encode(Buffer.from(tag)),
    },
  });

  export const topicAuthorFilter = (authorKey: string) => ({
    memcmp: {
      offset:
        8, // Discriminator.
      bytes: authorKey,
    },
  });


export default fetchTopics;