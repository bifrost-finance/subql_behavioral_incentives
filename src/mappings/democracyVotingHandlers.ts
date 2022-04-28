import { SubstrateEvent } from "@subql/types";
import { DemocracyVoting } from "../types";
import { AccountId } from "@polkadot/types/interfaces";
import { makeSureAccount } from "./utils";

// Handing talbe【DemocracyVoting】, event【Voted】
export async function handleDemocracyVoting(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();
  //Create the record by constructing id from blockNumber + eventIndex
  const record = new DemocracyVoting(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );

  const {
    event: {
      data: [accountRaw, , accountVote],
    },
  } = event;

  const account = (accountRaw as AccountId).toString();
  const voteInfo = JSON.parse(JSON.stringify(accountVote));
  const amount = BigInt(voteInfo.standard.balance);

  await makeSureAccount(account);
  record.accountId = account;
  record.event = "Voted";
  record.token = "BNC";
  record.amount = amount;
  record.blockHeight = blockNumber;
  record.timestamp = event.block.timestamp;

  await record.save();
}
