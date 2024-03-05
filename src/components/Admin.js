import React from 'react'
import "./Admin.css"
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { getErrorMessageFromFormattedString, initializeVault, withdrawFromVault } from '../program/game-func'
import { connection } from '../program/environment'
import { toast } from 'react-toastify'

const Admin = () => {
    const wallet = useAnchorWallet()

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
                            skipPreflight: true
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
    
                const allTx = [];
                    const tx = await withdrawFromVault(wallet)
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
                            skipPreflight: true
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

  return (
    <div>
        <button className="initialize-vault-btn" onClick={initialize}>
            Init Vault
        </button>
        <button className="initialize-vault-btn" onClick={withdraw}>
            withdraw Vault
        </button>
    </div>
  )
}

export default Admin