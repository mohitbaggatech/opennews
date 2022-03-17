import * as anchor from "@project-serum/anchor";

export type AccountData = {
  author: anchor.web3.PublicKey;
  parentTopic: anchor.web3.PublicKey;
  parent: anchor.web3.PublicKey;
  timestamp: anchor.BN;
  annotation: string;
  allegations: number;
    support: number;
    against: number;
    old_annotation: anchor.web3.PublicKey;
    isEdited: number;
    editedOn: anchor.BN;
    edited: anchor.web3.PublicKey;
    uri: string;
    snippetType: number;
};
export class Annotation {
  publicKey: anchor.web3.PublicKey;
  author: anchor.web3.PublicKey;
  parentTopic: anchor.web3.PublicKey;
  parent: anchor.web3.PublicKey;
  timestamp: string;
  allegations: number;
    support: number;
    against: number;
    annotation: string;
    isEdited: number;
    editedOn: string;
    edited: anchor.web3.PublicKey;
    uri: string;
    snippet_type: number;
    old_annotation: anchor.web3.PublicKey;

  constructor(publicKey: anchor.web3.PublicKey, accountData: AccountData) {
    this.publicKey = publicKey;
    this.author = accountData.author;
    this.timestamp = accountData.timestamp.toString();
    this.parentTopic = accountData.parentTopic;
    this.parent = accountData.parent;
    this.allegations = accountData.allegations;
    this.support = accountData.support;
    this.against = accountData.against;
    this.annotation = accountData.annotation;
    this.uri = accountData.uri;
    this.snippet_type = accountData.snippetType;
    this.old_annotation = accountData.old_annotation;
    this.isEdited = accountData.isEdited;
    this.editedOn = accountData.editedOn ? accountData.editedOn.toString() : undefined;
    this.edited = accountData.edited;
  }

  get key() {
    return this.publicKey.toBase58();
  }

  get shortEditedKey() {
    const edited = this.edited.toBase58();
    // return author;
    return edited.slice(0, 4) + ".." + edited.slice(-4);
  }

  get authorDisplay() {
    const author = this.author.toBase58();
    // return author;
    return author.slice(0, 4) + ".." + author.slice(-4);
  }

  get editedAt() {
    const date = getDate(this.editedOn);
    console.log("EDITED ON : ", date);
    return date.toLocaleDateString();
  }

  get createdAt() {
    const date = getDate(this.timestamp);
    return date.toLocaleDateString();
  }

  get createdAgo() {
    const date = getDate(this.timestamp);
    return timeSince(date);
  }
}

// convert unix timestamp to js date object
const getDate = (timestamp: string) => {
  const utxDate = parseInt(timestamp);
  const date = new Date(utxDate * 1000);
  return date;
};

function timeSince(date: any) {
  var seconds = Math.floor(((new Date() as any) - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
var aDay = 24 * 60 * 60 * 1000;