import { SubstrateEvent } from "@subql/types";

import {
  Account,
  DemocracyVoting,
  ParachainStaking,
  SalpContribution,
  SlpMinting,
  VstokenConversion,
  VtokenTransferOut,
  ZenlinkLiquidity,
  ZenlinkVtokenSwap,
  Token,
  RewardCoefficients,
  CampaignInfo,
  StakingExtraRewards,
} from "../types";
import { Balance, AccountId } from "@polkadot/types/interfaces";
import {
  CurrencyId,
  TokenSymbol,
} from "@bifrost-finance/type-definitions/json/types.json";

// Handing talbe【DemocracyVoting】, event【Voted】
export async function handleDemocracyVoting(
  event: SubstrateEvent
): Promise<void> {
  const blockNumber = event.block.block.header.number.toNumber();
  //Create the record by constructing id from blockNumber + eventIndex
  const record = new DemocracyVoting(
    `${blockNumber.toString()}${event.idx.toString()}`
  );

  const {
    event: {
      data: [accountRaw, _refIndex, accountVote],
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

// If the account doesn't
async function makeSureAccount(account: string): Promise<void> {
  const checkAccount = await Account.get(account);

  if (!checkAccount) {
    await new Account(account).save();
  }
}
