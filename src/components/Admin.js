import React, { useEffect, useState } from 'react'
import "./Admin.css"
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { getErrorMessageFromFormattedString, initializeVault, program, withdrawFromVault, vaultAddress, tokenMint } from '../program/game-func'
import { connection } from '../program/environment'
import { toast } from 'react-toastify'
import { getAssociatedTokenAddress } from '@solana/spl-token'

const Admin = () => {
    const wallet = useAnchorWallet()
    const [balance, setBalance] = useState(null)
    const [amountToWithDraw, setAmountToWithDraw] = useState(0)

    const initialize = async () => {
        try {
            if (wallet.publicKey && wallet) {
                if (!wallet) {
                    return
                }
    
                const allTx = [];
                    const tx = await initializeVault(wallet)
                    if (!tx) {
                        return
                    }
                    tx.feePayer = wallet.publicKey
                    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
                    allTx.push(tx)
    
                const signedTxs = await wallet.signAllTransactions(allTx)
    
                for (let tx of signedTxs) {
                    await connection.sendRawTransaction(
                        tx.serialize(),
                        {
                            skipPreflight: false
                        }
                    )
                }
            }
        } catch (e) {
            // toast.error(e.message)
            console.log(e)
        }
    }

    const withdraw = async () => {
        try {
            if (wallet.publicKey && wallet) {
                if (!wallet) {
                    return
                }
                if(amountToWithDraw === 0){
                    toast.error("Please Enter Amount To WithDraw!!!");
                    return
                }
                if(amountToWithDraw > balance){
                    toast.error("Enter a valid amount");
                    return
                }
    
                const allTx = [];
                    const tx = await withdrawFromVault(wallet, amountToWithDraw)
                    if (!tx) {
                        return
                    }
                    tx.feePayer = wallet.publicKey
                    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
                    allTx.push(tx)
    
                const signedTxs = await wallet.signAllTransactions(allTx)
    
                for (let tx of signedTxs) {
                    await connection.sendRawTransaction(
                        tx.serialize(),
                        {
                            skipPreflight: false
                        }
                    )
                }
            }
        } catch (e) {
            let error = getErrorMessageFromFormattedString(e.message)
            toast.error(error)
            console.log(e)
        }
    }

    useEffect(()=>{
        (async()=>{
            let vaultAta = await getAssociatedTokenAddress(tokenMint, vaultAddress, true)
            let vaultBalance = await connection.getTokenAccountBalance(vaultAta);
            // console.log(vaultAta.toString(), vaultBalance?.value?.uiAmount)
            setBalance(vaultBalance?.value?.uiAmount)

        })();
      },[wallet])

  return (
    <div className='admin-page'>
        {vaultAddress ? <p className='vault-addr'>Vault Address : {vaultAddress.toString()}</p> : null}
        {balance ? <p className='vault-addr'>Vault Balance : {balance}</p> : null}
        {!vaultAddress && !balance ? <button className="initialize-vault-btn" onClick={initialize}>
            Init Vault
        </button> : null}
        <button className="initialize-vault-btn" onClick={initialize}>
            Init Vault
        </button> 
        <input type="number" placeholder='Amount' className='withdraw-input' value={amountToWithDraw} onChange={(e)=>{setAmountToWithDraw(parseFloat(e.target.value))}} />
        <button className="initialize-vault-btn" onClick={withdraw}>
            Withdraw Vault
        </button>
    </div>
  )
}

export default Admin