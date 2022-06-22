import { makeSureAccount, getPricision } from "./utils";
import { SubstrateExtrinsic } from "@subql/types";
import { Balance, AccountId } from "@polkadot/types/interfaces";
import { Add } from "../types";
// import { BigNumber } from "bignumber.js";

import { ApiPromise } from "@polkadot/api";
import { WsProvider } from "@polkadot/rpc-provider";
import { options } from "@bifrost-finance/api";

async function initilize_api() {
  const provider = new WsProvider(
    "wss://bifrost-parachain.api.onfinality.io/public-ws"
  );
  const bifrostApi = await new ApiPromise(options({ provider }));
  await bifrostApi.isReady;

  return bifrostApi;
}

// Handing module【Utility】, event【BatchAll】
export async function handleSystemRemarkWithEvent(
  extrinsic: SubstrateExtrinsic
): Promise<void> {
  //   const record = new Add(extrinsic.block.block.header.hash.toString());
  //   record.field4 = extrinsic.block.timestamp;
  //   await record.save();

  let bifrostApi = await initilize_api();

  // let hex = extrinsic.extrinsic;
  let hex =
    "0x9d0284001cfe70cd1db74d433bf1542fc406dae26a374d46582dc3710a109ef4dc40242801002bfc3bcd0024795670a6366b9ca5b594f6f09fd2c7aa565473387b1a47d85e0f61e4ccb5b1d98548b57315478a5cc8ed3434a31744dcf9d17cb07bd6d1b080d40100003202080008407a656e6c696e6b2d7472616e736665720a0000f01a5a55b159add60ac0f253cc03069ad5658bb0233be0a501f349b512c94e510b005039278c04";
  let decoded = await bifrostApi.tx(hex);
  let extrinsicCall = bifrostApi.createType("Call", decoded.method);
  logger.info(`${JSON.stringify(decoded)}`);
}
