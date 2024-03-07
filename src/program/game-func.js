import * as anchor from "@project-serum/anchor"
import { connection } from "./environment";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, TokenOwnerOffCurveError, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import idl from './idl.json'
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram, Transaction } from "@solana/web3.js";


const NEW_GAME_SEEDS = "new-game";
const VAULT_SEED = "game-vault";
export const tokenMint = new PublicKey("6decN7PPe4Nh5k8PmuGxwfxeAkpNJJt6LGaTfsdC7Pyh");
export const vaultAddress = new PublicKey("CuBxLBcTkYo3k7FrrcfsNxAU7pXXongHwCE7ZntpE65S");
export const feeWallet = new PublicKey("CjGrhwpGrhWmyqHahZtEFRw4ASm5oqLXjri5zzUsCyFw");

export const getProvider = (wallet) => {
    const provider = new anchor.AnchorProvider(
      connection, wallet, { "preflightCommitment": "processed" },
    );
    return provider;
}

export const program = (wallet) => {
  const provider = getProvider(wallet)
  const program = new anchor.Program(idl , idl.metadata.address, provider);
  return program
}

export const initializeVault = async (wallet) => {
  try {
    const provider = getProvider(wallet)
    const program = new anchor.Program(idl , idl.metadata.address, provider);
    const tx = new Transaction();
    const vaultId = await findVaultId(wallet.publicKey)

    console.log(vaultId.toString())
    
    const vaultAta = await getAssociatedTokenAddress(
      tokenMint,
      vaultId,
      true
    )

    const txn = await program.methods.initalizeVault().accounts({
      vault : vaultId,
      vaultTokenAccount : vaultAta,
      tokenAddress : tokenMint,
      signer : wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram : ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent : SYSVAR_RENT_PUBKEY
    }).instruction()

    tx.add(txn)

    return tx
  } catch (e) {
    console.log(e)
  }
}

export const withdrawFromVault = async (wallet, amount) => {
  try {
    const provider = getProvider(wallet)
    const program = new anchor.Program(idl , idl.metadata.address, provider);
    const tx = new Transaction();
    
    const vaultAta = await getAssociatedTokenAddress(
      tokenMint,
      vaultAddress,
      true
    )

    const payerMintAta = await getAssociatedTokenAddress(
      tokenMint,
      wallet.publicKey
      );

    const txn = await program.methods.withDrawVault({amount : new anchor.BN(amount * 1000000)}).accounts({
      vault : vaultAddress,
      vaultTokenAccount : vaultAta,
      tokenAddress : tokenMint,
      signer : wallet.publicKey,
      signerTokenAccount : payerMintAta, 
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram : ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent : SYSVAR_RENT_PUBKEY
    }).instruction()

    tx.add(txn)

    return tx



  } catch (e) {
    console.log(e)
  }
}


export const initializeGame = async (wallet, tokenAmount, selectedSide) => {
  try {
    const gameIdentifier = `game-${Math.random()}`;
    const provider = getProvider(wallet)
    const program = new anchor.Program(idl , idl.metadata.address, provider);
    const tx = new Transaction();
    const newGameId = await findGameId(gameIdentifier)

    const payerMintAta = await getAssociatedTokenAddress(
      tokenMint,
      wallet.publicKey
      );
    
      const vaultAta = await getAssociatedTokenAddress(
        tokenMint,
        vaultAddress,
        true
      )

    const txn = await program.methods.createGame({identifier : gameIdentifier,amount : new anchor.BN(tokenAmount * 1000000), selectedSide : selectedSide }).accounts({
      newGame : newGameId,
      signer : wallet.publicKey,
      tokenAddress : tokenMint,
      vaultTokenAccount : vaultAta,
      payerTokenAccount: payerMintAta,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram : ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent : SYSVAR_RENT_PUBKEY
    }).instruction()

    tx.add(txn)

    return tx



  } catch (e) {
    console.log(e)
  }
}

export const joinGame = async (wallet, game) => {
  try {
    const provider = getProvider(wallet)
    const program = new anchor.Program(idl , idl.metadata.address, provider);
    const tx = new Transaction();
    const newGameId = game.publicKey;

    console.log(wallet.publicKey.toString())

    const payerMintAta = await getAssociatedTokenAddress(
      tokenMint,
      wallet?.publicKey
      );

    const creatorMintAta = await getAssociatedTokenAddress(
        tokenMint,
        game.account.creator
        );
    
        const vaultAta = await getAssociatedTokenAddress(
          tokenMint,
          vaultAddress,
          true
        )

    const txn = await program.methods.joinGame().accounts({
      newGame : newGameId,
      signer : wallet.publicKey,
      tokenAddress : tokenMint,
      vaultTokenAccount : vaultAta,
      payerTokenAccount: payerMintAta,
      creatorTokenAccount: creatorMintAta,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram : ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent : SYSVAR_RENT_PUBKEY
    }).instruction()

    tx.add(txn)

    return tx



  } catch (e) {
    console.log(e)
  }
}

export const playGameCtx = async (wallet, selectedSide, game) => {
  try {
    const provider = getProvider(wallet)
    const program = new anchor.Program(idl , idl.metadata.address, provider);
    const tx = new Transaction();
    const newGameId = game?.publicKey;

    const payerMintAta = await getAssociatedTokenAddress(
      tokenMint,
      wallet?.publicKey
      );

    const creatorMintAta = await getAssociatedTokenAddress(
        tokenMint,
        game.account.creator
        );

        const feeMintAta = await getAssociatedTokenAddress(
        tokenMint,
        feeWallet
        );
    
    const vaultAta = await getAssociatedTokenAddress(
    tokenMint,
    vaultAddress,
    true
    )

    const txn = await program.methods.playGame({selectedSide : selectedSide }).accounts({
      vault : vaultAddress,
      newGame : newGameId,
      vaultTokenAccount : vaultAta,
      tokenAddress : tokenMint,
      payerTokenAccount: payerMintAta,
      creatorTokenAccount: creatorMintAta,
      feeTokenAccount: feeMintAta,
      signer : wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram : ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent : SYSVAR_RENT_PUBKEY
    }).instruction()

    tx.add(txn)

    return tx



  } catch (e) {
    console.log(e)
  }
}

export const findGameId = (
  identifier
) => {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(NEW_GAME_SEEDS),
      anchor.utils.bytes.utf8.encode(identifier),
    ],
    new PublicKey(idl.metadata.address),
  )[0];
};

export const findVaultId = (
  wallet
) => {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(VAULT_SEED),
      wallet.toBuffer()
    ],
    new PublicKey(idl.metadata.address),
  )[0];
};

export const getErrorMessageFromFormattedString = (errorString) => {
  // Use a regular expression to extract the hex error code from the string
  const match = errorString.match(/custom program error: 0x([0-9a-fA-F]+)/);

  if (match && match[1]) {
      // Extracted hex error code from the regular expression match
      const hexErrorCode = match[1];

      // Convert the hex error code to a number and use the getErrorMessage function
      const errorCode = parseInt(hexErrorCode, 16);
      const errorMessage = getErrorMessage(errorCode);
      
      return errorMessage || "Error message not found for the provided error code";
  } else {
      // Handle the case where the hex error code cannot be extracted
      return errorString;
  }
}

function getErrorMessage(errorCode) {
  const error = errorCodes.find(err => err.code === errorCode);
  return error ? error.msg : "Unknown error code";
}

const errorCodes = [
  {
      "code": 6000,
      "name": "InvalidStake",
      "msg": "Invalid stake amount."
  },
  {
      "code": 6001,
      "name": "GameNotFound",
      "msg": "Game not found."
  },
  {
      "code": 6002,
      "name": "GameNotActive",
      "msg": "Game is not active."
  },
  {
      "code": 6003,
      "name": "CannotJoinOwnGame",
      "msg": "Cannot join your own game."
  },
  {
      "code": 6004,
      "name": "GameAlreadyJoined",
      "msg": "This game has already been joined."
  },
  {
      "code": 6005,
      "name": "InvalidGameState",
      "msg": "Invalid game state for this operation."
  },
  {
      "code": 6006,
      "name": "InvalidAccount",
      "msg": "Invalid account."
  },
  {
      "code": 6007,
      "name": "InvalidChoice",
      "msg": "Invalid Choice."
  },
  {
      "code": 6008,
      "name": "CannotPlayThisGame",
      "msg": "Cannot play this game."
  },
  {
      "code": 6009,
      "name": "InvalidAdmin",
      "msg": "Invalid Admin."
  }
]