import {
  NFTPositionManager,
  Approval,
  ApprovalForAll,
  Collect,
  DecreaseLiquidity,
  IncreaseLiquidity,
  Transfer,
} from "../generated/NFTPositionManager/NFTPositionManager";
import { NftToken } from "../generated/schema";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export function handleApproval(event: Approval): void {}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleCollect(event: Collect): void {
  let id = event.params.tokenId.toHex();
  let nft = NftToken.load(id);
  if (nft == null) {
    nft = new NftToken(id);
  }
  nft.amount0 = nft.amount0.minus(event.params.amount0);
  nft.amount1 = nft.amount1.minus(event.params.amount1);
  nft.save();
}

export function handleDecreaseLiquidity(event: DecreaseLiquidity): void {
  let id = event.params.tokenId.toHex();
  let nft = NftToken.load(id);
  if (nft == null) {
    nft = new NftToken(id);
  }
  nft.amount0 = event.params.amount0;
  nft.amount1 = event.params.amount1;
  nft.liquidity = nft.liquidity.minus(event.params.liquidity);
  nft.save();
}

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
  let id = event.params.tokenId.toHex();
  let nft = NftToken.load(id);
  if (nft == null) {
    nft = new NftToken(id);
  }

  nft.userAddress = event.transaction.from;
  nft.tokenId = event.params.tokenId;
  nft.liquidity = event.params.liquidity;
  nft.amount0 = event.params.amount0;
  nft.amount1 = event.params.amount1;
  nft.isBurned = false;

  nft.save();
}

export function handleTransfer(event: Transfer): void {
  let id = event.params.tokenId.toHex();
  let nft = NftToken.load(id);
  if (nft == null) {
    nft = new NftToken(id);
  }
  if (
    event.params.to.toHexString() == ADDRESS_ZERO &&
    event.params.tokenId == nft.tokenId
  ) {
    nft.isBurned = true;
    nft.save();
  }
}
