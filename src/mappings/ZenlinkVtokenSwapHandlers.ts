import { SubstrateEvent } from "@subql/types";
import { BigNumber } from "bignumber.js";
import { Account, ZenlinkVtokenSwap } from "../types";
import { Balance, AccountId } from "@polkadot/types/interfaces";
import { makeSureAccount, convertFromZenlinkAssetId } from "./utils";

// Handing talbe【ZenlinkProtocol】, Event【AssetSwap】
export async function handleZenlinkProtocolAssetSwap(
  event: SubstrateEvent
): Promise<void> {
  //   logger.info(`${event}`);
  const blockNumber = event.block.block.header.number.toNumber();
  const evt = JSON.parse(JSON.stringify(event));
  //Create the record by constructing id from blockNumber + eventIndex
  const record = new ZenlinkVtokenSwap(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [address, , currency_list, amount_list],
    },
  } = evt;

  const assetIndex = currency_list[0].assetIndex;
  const vtokenAmount = amount_list[0];
  const { tokenType, tokenName } = convertFromZenlinkAssetId(assetIndex);

  // If it the swap asset in is vtoken.
  if (tokenType.toUpperCase().startsWith("VT")) {
    const token = tokenName.toUpperCase();
    const vtoken = "V".concat(token);
    const account = (address as AccountId).toString();
    const amount = BigInt((vtokenAmount as Balance).toString());
    // Get VKSM issuance storage.
    const vtokenIssuance = new BigNumber(
      (await api.query.tokens.totalIssuance({ VToken: token })).toString()
    );
    // Get KSM pooltoken storage.
    const poolToken = new BigNumber(
      (await api.query.vtokenMinting.tokenPool({ Token: token })).toString()
    );
    // Calculate exchange rate.
    let exchangeRate = new BigNumber(1);
    if (vtokenIssuance > new BigNumber(0)) {
      exchangeRate = poolToken.div(vtokenIssuance);
    }
    await makeSureAccount(account);
    record.accountId = account;
    record.event = "AssetSwap";
    record.token = vtoken;
    record.amount = amount;
    record.blockHeight = blockNumber;
    record.timestamp = event.block.timestamp;
    record.exchangeRate = exchangeRate.toNumber();
    await record.save();
  }
}
