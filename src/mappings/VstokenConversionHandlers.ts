import { makeSureAccount } from "./utils";
import { SubstrateEvent } from "@subql/types";
import { Balance, AccountId } from "@polkadot/types/interfaces";
import { BigNumber } from "bignumber.js";

import { VstokenConversion } from "../types";

// Handing talbe【VstokenConversion】, Event【VsbondConvertToVsksm】
export async function handleVstokenConversionVsbondConvertToVsksm(
  event: SubstrateEvent
): Promise<void> {
  //   logger.info(`${event}`);
  const blockNumber = event.block.block.header.number.toNumber();
  //Create the record by constructing id from blockNumber + eventIndex
  const record = new VstokenConversion(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [address, , , vtokenAmount],
    },
  } = event;

  const account = (address as AccountId).toString();
  const amount = BigInt((vtokenAmount as Balance).toString());

  // Get VKSM issuance storage.
  const vksmIssuance = new BigNumber(
    (await api.query.tokens.totalIssuance({ VToken: "KSM" })).toString()
  );

  // Get KSM pooltoken storage.
  const ksmPoolToken = new BigNumber(
    (await api.query.vtokenMinting.tokenPool({ Token: "KSM" })).toString()
  );

  // Calculate exchange rate.
  let exchangeRate = new BigNumber(1);
  if (vksmIssuance > new BigNumber(0)) {
    exchangeRate = ksmPoolToken.div(vksmIssuance);
  }

  await makeSureAccount(account);

  record.accountId = account;
  record.event = "VsbondConvertToVsksm";
  record.token = "VSKSM";
  record.amount = amount;
  record.blockHeight = blockNumber;
  record.timestamp = event.block.timestamp;
  record.exchangeRate = exchangeRate.toNumber();

  await record.save();
}

// Handing talbe【VstokenConversion】, Event【VsksmConvertToVsbond】
export async function handleVstokenConversionVsksmConvertToVsbond(
  event: SubstrateEvent
): Promise<void> {
  //   logger.info(`${event}`);
  const blockNumber = event.block.block.header.number.toNumber();
  //Create the record by constructing id from blockNumber + eventIndex
  const record = new VstokenConversion(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [address, , , vtokenAmount],
    },
  } = event;

  const account = (address as AccountId).toString();
  const amount = BigInt((vtokenAmount as Balance).toString());

  // Get VKSM issuance storage.
  const vksmIssuance = new BigNumber(
    (await api.query.tokens.totalIssuance({ VToken: "KSM" })).toString()
  );

  // Get KSM pooltoken storage.
  const ksmPoolToken = new BigNumber(
    (await api.query.vtokenMinting.tokenPool({ Token: "KSM" })).toString()
  );

  // Calculate exchange rate.
  let exchangeRate = new BigNumber(1);
  if (vksmIssuance > new BigNumber(0)) {
    exchangeRate = ksmPoolToken.div(vksmIssuance);
  }

  await makeSureAccount(account);

  record.accountId = account;
  record.event = "VsksmConvertToVsbond";
  record.token = "VSKSM";
  record.amount = amount;
  record.blockHeight = blockNumber;
  record.timestamp = event.block.timestamp;
  record.exchangeRate = exchangeRate.toNumber();

  await record.save();
}
