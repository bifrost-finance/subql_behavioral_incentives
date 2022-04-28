import { SubstrateEvent } from "@subql/types";
import { makeSureAccount } from "./utils";

import { SalpContribution } from "../types";
import { Balance, AccountId } from "@polkadot/types/interfaces";

// Handing talbe【Salp】, event【Contributed】
export async function handleSalpContributed(
  event: SubstrateEvent
): Promise<void> {
  //   logger.info(`${event}`);
  const blockNumber = event.block.block.header.number.toNumber();
  //Create the record by constructing id from blockNumber + eventIndex
  const record = new SalpContribution(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [contributor, , contributedAmount],
    },
  } = event;
  const account = (contributor as AccountId).toString();
  const amount = BigInt((contributedAmount as Balance).toString());
  await makeSureAccount(account);
  record.accountId = account;
  record.event = "Contributed";
  record.token = "KSM";
  record.amount = amount;
  record.blockHeight = blockNumber;
  record.timestamp = event.block.timestamp;
  await record.save();
}

// Handing talbe【SalpLite】, event【Issued】
export async function handleSalpLiteIssued(
  event: SubstrateEvent
): Promise<void> {
  //   logger.info(`${event}`);
  const blockNumber = event.block.block.header.number.toNumber();
  //Create the record by constructing id from blockNumber + eventIndex
  const record = new SalpContribution(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [contributor, , IssuedAmount],
    },
  } = event;
  const account = (contributor as AccountId).toString();
  const amount = BigInt((IssuedAmount as Balance).toString());
  await makeSureAccount(account);
  record.accountId = account;
  record.event = "Issued";
  record.token = "DOT";
  record.amount = amount;
  record.blockHeight = blockNumber;
  record.timestamp = event.block.timestamp;

  await record.save();
}
