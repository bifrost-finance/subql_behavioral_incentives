import { makeSureAccount } from "./utils";
import { SubstrateEvent } from "@subql/types";
import { Balance, AccountId } from "@polkadot/types/interfaces";
import { SlpMinting } from "../types";

// Handing talbe【VtokenMinting】, Event【Minted】
export async function handleVtokenMintingMinted(
  event: SubstrateEvent
): Promise<void> {
  //   logger.info(`${event}`);
  let evt = JSON.parse(JSON.stringify(event));
  const blockNumber = event.block.block.header.number.toNumber();
  //   Create the record by constructing id from blockNumber + eventIndex
  const record = new SlpMinting(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [address, { token: tokenName }, tokenAmount],
    },
  } = evt;

  const account = (address as AccountId).toString();
  const amount = BigInt((tokenAmount as Balance).toString());
  await makeSureAccount(account);
  record.accountId = account;
  record.event = "Minted";
  record.token = tokenName;
  record.amount = amount;
  record.blockHeight = blockNumber;
  record.timestamp = event.block.timestamp;
  await record.save();
}

// Handing talbe【VtokenMinting】, Event【Redeemed】
export async function handleVtokenMintingRedeemed(
  event: SubstrateEvent
): Promise<void> {
  //   logger.info(`${event.event}`);
  let evt = JSON.parse(JSON.stringify(event));
  const blockNumber = event.block.block.header.number.toNumber();
  //   Create the record by constructing id from blockNumber + eventIndex
  const record = new SlpMinting(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [address, { token: tokenName }, tokenAmount],
    },
  } = evt;

  const account = (address as AccountId).toString();
  const amount = BigInt((tokenAmount as Balance).toString());
  await makeSureAccount(account);
  record.accountId = account;
  record.event = "Redeemed";
  record.token = tokenName;
  record.amount = amount;
  record.blockHeight = blockNumber;
  record.timestamp = event.block.timestamp;
  await record.save();
}
