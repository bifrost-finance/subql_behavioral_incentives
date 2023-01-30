import { makeSureAccount, getPricision, hex_to_ascii } from "./utils";
import { SubstrateEvent } from "@subql/types";
import { Balance, AccountId } from "@polkadot/types/interfaces";
import { AddDot, SubtractDot } from "../types";
import { BigNumber } from "bignumber.js";

// Handing talbe【VtokenMinting】, Event【Minted】
export async function handleVtokenMintingMinted(
  event: SubstrateEvent
): Promise<void> {
  //   logger.info(`${event}`);
  let evt = JSON.parse(JSON.stringify(event));
  const blockNumber = event.block.block.header.number.toNumber();
  //   Create the record by constructing id from blockNumber + eventIndex
  const record = new AddDot(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [address, currencyId, tokenAmount],
    },
  } = evt;

  // token type
  let tokenName;
  if (currencyId.token || currencyId.native) {
    tokenName = currencyId.token ? currencyId.token : currencyId.native;
    // token2 type
  } else {
    let tokenId = currencyId.token2;

    let metadata = (
      await api.query.assetRegistry.currencyMetadatas({ Token2: tokenId })
    ).toString();

    let meta = JSON.parse(metadata);
    tokenName = hex_to_ascii(meta.symbol).toUpperCase();
  }

  const account = (address as AccountId).toString();
  const amount = BigInt((tokenAmount as Balance).toString());

  const exchangeRate = 1;
  const precision = getPricision(tokenName.toUpperCase());
  const base = new BigNumber(amount.toString())
    .dividedBy(precision)
    .multipliedBy(exchangeRate);

  await makeSureAccount(account);
  record.accountId = account;
  record.event = "Minted";
  record.token = tokenName.toUpperCase();
  record.amount = amount;
  record.blockHeight = blockNumber;
  record.timestamp = event.block.timestamp;
  record.exchangeRate = exchangeRate;
  record.base = base.toNumber();

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
  const record = new SubtractDot(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [address, currencyId, tokenAmount],
    },
  } = evt;

  // token type
  let tokenName;
  if (currencyId.token || currencyId.native) {
    tokenName = currencyId.token ? currencyId.token : currencyId.native;
    // token2 type
  } else {
    let tokenId = currencyId.token2;

    let metadata = (
      await api.query.assetRegistry.currencyMetadatas({ Token2: tokenId })
    ).toString();

    let meta = JSON.parse(metadata);
    tokenName = hex_to_ascii(meta.symbol).toUpperCase();
  }

  const account = (address as AccountId).toString();
  const amount = BigInt((tokenAmount as Balance).toString());

  const exchangeRate = 1;
  const precision = getPricision(tokenName.toUpperCase());
  const base = new BigNumber(amount.toString())
    .dividedBy(precision)
    .multipliedBy(exchangeRate)
    .multipliedBy(-1);

  await makeSureAccount(account);
  record.accountId = account;
  record.event = "Redeemed";
  record.token = tokenName.toUpperCase();
  record.amount = amount;
  record.blockHeight = blockNumber;
  record.timestamp = event.block.timestamp;
  record.exchangeRate = exchangeRate;
  record.base = base.toNumber();

  await record.save();
}
