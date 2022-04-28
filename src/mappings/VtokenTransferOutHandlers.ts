import { SubstrateEvent, SubstrateExtrinsic } from "@subql/types";
import { BigNumber } from "bignumber.js";
import { Account, VtokenTransferOut } from "../types";
import { Balance, AccountId } from "@polkadot/types/interfaces";
import { makeSureAccount } from "./utils";

// Handing talbe【Currencies】, Event【Transferred】
export async function handleVtokenTransferOut(
  event: SubstrateEvent
): Promise<void> {
  //   logger.info(`${event}`);
  const blockNumber = event.block.block.header.number.toNumber();
  const evt = JSON.parse(JSON.stringify(event));
  //Create the record by constructing id from blockNumber + eventIndex
  const record = new VtokenTransferOut(
    `${blockNumber.toString()}-${event.idx.toString()}`
  );
  const {
    event: {
      data: [currencyId, address, to, vtokenAmount],
    },
  } = evt;

  const tokenType = Object.keys(currencyId)[0].toUpperCase();

  // "eCSrvaystgdffuJxPVYKf8H8UYnHGNRdVGUvj1SWSiatWMq" is the vksm-ksm swap pool account.
  // "eCSrvbA5gGNYdM3UjBNxcBNBqGxtz3SEEfydKragtL4pJ4F" is the Bifrost treasury account for charging vtoken redeeming fee.
  let poolAccountList = [
    "eCSrvaystgdffuJxPVYKf8H8UYnHGNRdVGUvj1SWSiatWMq",
    "eCSrvbA5gGNYdM3UjBNxcBNBqGxtz3SEEfydKragtL4pJ4F",
  ];

  // If it is vtoken and the "to"+ "from" addresses are not vtoken swap pool account and not treasury account.
  if (
    tokenType.startsWith("VT") &&
    !poolAccountList.includes((to as AccountId).toString()) &&
    !poolAccountList.includes((address as AccountId).toString())
  ) {
    const token = Object.values(currencyId)[0].toString().toUpperCase();
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
    record.event = "TransferredOut";
    record.token = vtoken;
    record.amount = amount;
    record.blockHeight = blockNumber;
    record.timestamp = event.block.timestamp;
    record.exchangeRate = exchangeRate.toNumber();
    await record.save();
  }
}
