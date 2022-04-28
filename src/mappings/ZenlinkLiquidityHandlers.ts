import {
  makeSureAccount,
  convertFromZenlinkAssetId,
  sortZenlinkAssetId,
} from "./utils";
import { SubstrateEvent } from "@subql/types";
import { Balance, AccountId } from "@polkadot/types/interfaces";

import { ZenlinkLiquidity } from "../types";

// Handing talbe【ZenlinkProtocol】, Event【LiquidityAdded】
export async function handleZenlinkProtocolLiquidityAdded(
  event: SubstrateEvent
): Promise<void> {
  // logger.info(`${event}`);
  const blockNumber = event.block.block.header.number.toNumber();
  const evt = JSON.parse(JSON.stringify(event));
  //Create the record by constructing id from blockNumber + eventIndex
  const record = new ZenlinkLiquidity(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [
        address,
        { assetIndex: tokenIndex_1 },
        { assetIndex: tokenIndex_2 },
        tokenAmount_1,
        tokenAmount_2,
      ],
    },
  } = evt;

  // VToken is sorted before Token.
  const { vtokenType, vtokenName, tokenType, tokenName, tokenAmount } =
    getTokenAndVtoken(tokenIndex_1, tokenIndex_2, tokenAmount_1, tokenAmount_2);

  if (vtokenType && vtokenName && tokenType && tokenName) {
    // If they are vtoken/token pair.
    if (
      vtokenType.toUpperCase().startsWith("VT") &&
      tokenType.toUpperCase().startsWith("TO") &&
      vtokenName == tokenName
    ) {
      const account = (address as AccountId).toString();
      const amount = BigInt((tokenAmount as Balance).toString());

      await makeSureAccount(account);

      record.accountId = account;
      record.event = "LiquidityAdded";
      record.token = tokenName.toUpperCase();
      record.amount = amount;
      record.blockHeight = blockNumber;
      record.timestamp = event.block.timestamp;

      await record.save();
    }
  }
}

// Handing talbe【ZenlinkProtocol】, Event【LiquidityRemoved】
export async function handleZenlinkProtocolLiquidityRemoved(
  event: SubstrateEvent
): Promise<void> {
  // logger.info(`${event}`);
  const blockNumber = event.block.block.header.number.toNumber();
  const evt = JSON.parse(JSON.stringify(event));
  //Create the record by constructing id from blockNumber + eventIndex
  const record = new ZenlinkLiquidity(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [
        address,
        ,
        { assetIndex: tokenIndex_1 },
        { assetIndex: tokenIndex_2 },
        tokenAmount_1,
        tokenAmount_2,
      ],
    },
  } = evt;

  const { vtokenType, vtokenName, tokenType, tokenName, tokenAmount } =
    getTokenAndVtoken(tokenIndex_1, tokenIndex_2, tokenAmount_1, tokenAmount_2);

  if (vtokenType && vtokenName && tokenType && tokenName) {
    // If they are vtoken/token pair.
    if (
      vtokenType.toUpperCase().startsWith("VT") &&
      tokenType.toUpperCase().startsWith("TO") &&
      vtokenName == tokenName
    ) {
      const account = (address as AccountId).toString();
      const amount = BigInt((tokenAmount as Balance).toString());

      await makeSureAccount(account);

      record.accountId = account;
      record.event = "LiquidityRemoved";
      record.token = tokenName.toUpperCase();
      record.amount = amount;
      record.blockHeight = blockNumber;
      record.timestamp = event.block.timestamp;

      await record.save();
    }
  }
}

function getTokenAndVtoken(
  tokenIndex_1: number,
  tokenIndex_2: number,
  tokenAmount_1: Balance,
  tokenAmount_2: Balance
) {
  // VToken is sorted before Token.
  let ordered = sortZenlinkAssetId(tokenIndex_1, tokenIndex_2);
  let firstIndex, secondIndex, tokenAmount;
  if (ordered) {
    firstIndex = tokenIndex_1;
    secondIndex = tokenIndex_2;
    tokenAmount = tokenAmount_2;
  } else {
    firstIndex = tokenIndex_2;
    secondIndex = tokenIndex_1;
    tokenAmount = tokenAmount_1;
  }

  // Check if this is vtoken/token pair. If yes, continue
  const { tokenType: vtokenType, tokenName: vtokenName } =
    convertFromZenlinkAssetId(firstIndex);
  const { tokenType, tokenName } = convertFromZenlinkAssetId(secondIndex);

  return { vtokenType, vtokenName, tokenType, tokenName, tokenAmount };
}
