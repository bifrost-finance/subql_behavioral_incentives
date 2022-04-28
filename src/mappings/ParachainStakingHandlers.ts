import { SubstrateEvent, SubstrateExtrinsic } from "@subql/types";
import { makeSureAccount } from "./utils";
import { ParachainStaking } from "../types";
import { Balance, AccountId } from "@polkadot/types/interfaces";

// Handing talbe【ParachainStaking】, event【Delegation】
export async function handleParachainStakingDelegation(
  event: SubstrateEvent
): Promise<void> {
  //   logger.info(`${event}`);
  const blockNumber = event.block.block.header.number.toNumber();
  //Create the record by constructing id from blockNumber + eventIndex
  const record = new ParachainStaking(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [delegator, lockedAmount],
    },
  } = event;
  const account = (delegator as AccountId).toString();

  const amount = BigInt((lockedAmount as Balance).toString());
  await makeSureAccount(account);
  record.accountId = account;
  record.event = "Delegation";
  record.token = "BNC";
  record.amount = amount;
  record.blockHeight = blockNumber;
  record.timestamp = event.block.timestamp;
  await record.save();
}

// Handing talbe【ParachainStaking】, event【DelegationIncreased】
export async function handleParachainStakingDelegationIncreased(
  event: SubstrateEvent
): Promise<void> {
  //   logger.info(`${event}`);
  const blockNumber = event.block.block.header.number.toNumber();
  //Create the record by constructing id from blockNumber + eventIndex
  const record = new ParachainStaking(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [delegator, , increasedAmount],
    },
  } = event;
  const account = (delegator as AccountId).toString();
  const amount = BigInt((increasedAmount as Balance).toString());
  await makeSureAccount(account);
  record.accountId = account;
  record.event = "DelegationIncreased";
  record.token = "BNC";
  record.amount = amount;
  record.blockHeight = blockNumber;
  record.timestamp = event.block.timestamp;
  await record.save();
}

// Handing talbe【ParachainStaking】, event【DelegationDecreased】
export async function handleParachainStakingDelegationDecreased(
  event: SubstrateEvent
): Promise<void> {
  //   logger.info(`${event}`);
  const blockNumber = event.block.block.header.number.toNumber();
  //Create the record by constructing id from blockNumber + eventIndex
  const record = new ParachainStaking(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [delegator, , decreasedAmount],
    },
  } = event;
  const account = (delegator as AccountId).toString();
  const amount = BigInt((decreasedAmount as Balance).toString());
  await makeSureAccount(account);
  record.accountId = account;
  record.event = "DelegationDecreased";
  record.token = "BNC";
  record.amount = amount;
  record.blockHeight = blockNumber;
  record.timestamp = event.block.timestamp;
  await record.save();
}

// Handing talbe【ParachainStaking】, event【DelegationRevoked】
export async function handleParachainStakingDelegationRevoked(
  event: SubstrateEvent
): Promise<void> {
  //   logger.info(`${event}`);
  const blockNumber = event.block.block.header.number.toNumber();
  //Create the record by constructing id from blockNumber + eventIndex
  const record = new ParachainStaking(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [delegator, , revokedAmount],
    },
  } = event;
  const account = (delegator as AccountId).toString();
  const amount = BigInt((revokedAmount as Balance).toString());
  await makeSureAccount(account);
  record.accountId = account;
  record.event = "DelegationRevoked";
  record.token = "BNC";
  record.amount = amount;
  record.blockHeight = blockNumber;
  record.timestamp = event.block.timestamp;
  await record.save();
}
