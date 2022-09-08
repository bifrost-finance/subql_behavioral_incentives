import { SubstrateBlock } from "@subql/types";
import { DotCurrentBlock } from "../types";

// Used to update current block.
export async function handleBlock(block: SubstrateBlock): Promise<void> {
  //Create a new starterEntity with ID using block hash
  let record = await DotCurrentBlock.get("1");
  if (!record) {
    record = new DotCurrentBlock("1");
  }
  //Record polkadot-bifrost block number
  record.dot_current = block.block.header.number.toNumber();
  await record.save();
}
