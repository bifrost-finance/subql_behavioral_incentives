import { SubstrateEvent } from "@subql/types";
import { BigNumber } from "bignumber.js";
import { Subtract } from "../types";
import { Balance, AccountId } from "@polkadot/types/interfaces";
import { makeSureAccount, getPricision } from "./utils";

// Handing talbe【Tokens】, Event【Transfer】
export async function handleVtokenTransferOut(
  event: SubstrateEvent
): Promise<void> {
  //   logger.info(`${event}`);
  const blockNumber = event.block.block.header.number.toNumber();
  const evt = JSON.parse(JSON.stringify(event));
  //Create the record by constructing id from blockNumber + eventIndex
  const record = new Subtract(
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
  // "eCSrvbA5gGMTkdAd9pGvdbNfkKmHKNwGR8uWsrh1G3aWSRG" is the VKSM single token liquidity-mining pool account for mainnet. pool id 56.
  // "eCSrvbA5gGMTkdAd9Z5P96SQ4UheKhx4pWNg5Pu734mRHbm" is one of the two VKSM single token liquidity-mining pools account for TESTNET. pool id is 0.
  // "eCSrvbA5gGMTkdAd9ZcsCBcd3q6ZRuhYAPPmxma2gpDxSVe" is one of the two VKSM single token liquidity-mining pools account for TESTNET. pool id is 2.
  // "eCSrvbA5gGMTkdAd9qddmKKEDhka5tJwmqTGbHsKPRDrSys" is the VKSM single token liquidity-mining pool account for mainnet. pool id 61.
  // "eCSrvbA5gGMTkdAd9ribsVfgCQYQJHotTbVUN3DAgv8vw4X" is the VKSM single token liquidity-mining pool account for mainnet. pool id 65.
  // "eCSrvbA5gGMTkdAd9tM42mCMATj9cu4JVEYn2ADweAWYtUH" is the VKSM single token liquidity-mining pool account for mainnet. pool id 71.
  // "eCSrvbA5gGLejANY2YTH6rTd7JxtybT57MyGfGdfqbBPVdZ" is the VKSM single token liquidity-mining pool account for mainnet.
  // "eCSrvbA5gGMTkdAd9ttY5rNa9p84j6omq7ZsuXtsHuy5uox" is the VKSM single token liquidity-mining pool account for mainnet. pool id 73.
  // "eCSrvaystgdffuJxPVRct68qJUZs1sFz762d7d37KJvb7Pz" is the VDOT-DOT zenlink swap pool for bifrost-polkadot.
  // "eCSrvbA5gGLejANY2XNJzg7B8cB4mBx8Rbw4tXHpY6GK5YE" is the vDOT farming Pool.
  // "eCSrvaystgdffuJxPVQfmrQY3XBfm6FPSBj1nJwmT48ASum" is the VMOVR farming pool account form bifrost-kusama.
  // "eCSrvaystgdffuJxPVZ7pEK8ZMmZ7Nwg2144eZYgWdx4g6v" is the VBNC farming pool account form bifrost-kusama.
  // "eCSrvaystgdffuJxPVbKj318eoUb12vu85hWk7CQFktdf79" is the VGLMR farming pool account form bifrost-polkadot.
  // "eCSrvaystgdffuJxPVNFYzcsVNZLG9E8TgSkUG1GcjD519E" is the vKSM/USDT LP tranding pair address.
  // "eCSrvbA5gGLejANY2bSSPqvrYk8w4i5AVhaL2ppkvDCMYFi" is the vKSM/USDT Farming Pool address.

  let poolAccountList = [
    "eCSrvaystgdffuJxPVYKf8H8UYnHGNRdVGUvj1SWSiatWMq",
    "eCSrvbA5gGNYdM3UjBNxcBNBqGxtz3SEEfydKragtL4pJ4F",
    "eCSrvbA5gGMTkdAd9pGvdbNfkKmHKNwGR8uWsrh1G3aWSRG",
    "eCSrvbA5gGMTkdAd9Z5P96SQ4UheKhx4pWNg5Pu734mRHbm",
    "eCSrvbA5gGMTkdAd9ZcsCBcd3q6ZRuhYAPPmxma2gpDxSVe",
    "eCSrvbA5gGMTkdAd9qddmKKEDhka5tJwmqTGbHsKPRDrSys",
    "eCSrvbA5gGMTkdAd9ribsVfgCQYQJHotTbVUN3DAgv8vw4X",
    "eCSrvbA5gGMTkdAd9tM42mCMATj9cu4JVEYn2ADweAWYtUH",
    "eCSrvbA5gGLejANY2YTH6rTd7JxtybT57MyGfGdfqbBPVdZ",
    "eCSrvbA5gGMTkdAd9ttY5rNa9p84j6omq7ZsuXtsHuy5uox",
    "eCSrvaystgdffuJxPVRct68qJUZs1sFz762d7d37KJvb7Pz",
    "eCSrvbA5gGLejANY2XNJzg7B8cB4mBx8Rbw4tXHpY6GK5YE",
    "eCSrvaystgdffuJxPVQfmrQY3XBfm6FPSBj1nJwmT48ASum",
    "eCSrvaystgdffuJxPVZ7pEK8ZMmZ7Nwg2144eZYgWdx4g6v",
    "eCSrvaystgdffuJxPVbKj318eoUb12vu85hWk7CQFktdf79",
    "eCSrvaystgdffuJxPVNFYzcsVNZLG9E8TgSkUG1GcjD519E",
    "eCSrvbA5gGLejANY2bSSPqvrYk8w4i5AVhaL2ppkvDCMYFi",
    "eCSrvbCVq8SWbxEi84eYaujvcegwkftytbeD7YZ2ieCJosL",
    "eCSrvbCVq8SWbxEi85C2dzv9c15rrseTEUfJzvDxNPeqmc4",
    "eCSrvbCVq8SWbxEi84vHcTL37KtQJmmiZY9m4EPVYWvaNmb",
    "eCSrvbCVq8SWbxEi85TmfYWG6gHKQyXBuRArwc4RCGP7ewN",
    "eCSrvaystgdffuJxPVS4SfFvaM26m6tAxwDLPvawBAYbnJd",
    "eCSrvaystgdffuJxPVPVePp3f8Zegp8AuNsTv4FApKHtAt9",
    "eCSrvaystgdffuJxPVLqSvWj7Qbjjd11SJEdYBQzs3FdYSk",
    "eCSrvaystgdffuJxPVSiQp5vXbGHHEbgQQQUaVb2ychB9Vz",
    "eCSrvbA5gGLejANY2XNJzg7B8cB4mBx8Rbw4tXHpY6GK5YE",
    // 平行链主权地址,不放到commission里
    // Moonbeam：eLHN5Pnz8aS3Dravd6Kt9LpSJiWPbSC25RS5a4wsfG6DYBX
    // Astar：eLHN5PoPNgo5TiCZt3nGWcxda3LgKJSDVs5LnQ54FL2g7q3
    // Interlay：eLHN5PtbY7WaZqBvEUhHHEoA1GARhZcmycRkYggRtDEZHud
    "eLHN5Pnz8aS3Dravd6Kt9LpSJiWPbSC25RS5a4wsfG6DYBX",
    "eLHN5PoPNgo5TiCZt3nGWcxda3LgKJSDVs5LnQ54FL2g7q3",
    "eLHN5PtbY7WaZqBvEUhHHEoA1GARhZcmycRkYggRtDEZHud",
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
    let poolToken;
    if (token == "BNC") {
      poolToken = new BigNumber(
        (await api.query.vtokenMinting.tokenPool({ Native: token })).toString()
      );
    } else {
      poolToken = new BigNumber(
        (await api.query.vtokenMinting.tokenPool({ Token: token })).toString()
      );
    }
    // Calculate exchange rate.
    let exchangeRate = new BigNumber(1);
    if (vtokenIssuance > new BigNumber(0)) {
      exchangeRate = poolToken.div(vtokenIssuance);
    }

    const precision = getPricision(token);
    const base = new BigNumber(amount.toString())
      .dividedBy(precision)
      .multipliedBy(exchangeRate)
      .multipliedBy(-1);

    await makeSureAccount(account);
    record.accountId = account;
    record.event = "TransferredOut";
    record.token = vtoken;
    record.amount = amount;
    record.blockHeight = blockNumber;
    record.timestamp = event.block.timestamp;
    record.exchangeRate = exchangeRate.toNumber();
    record.base = base.toNumber();

    await record.save();
  }
}
