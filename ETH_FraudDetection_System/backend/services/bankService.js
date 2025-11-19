const BankAccount = require('../models/BankAccount');
const { getContract } = require('../web3/fraudRegistry');
const { ethers } = require('ethers');

class BankService {
  /**
   * Link a wallet address to a bank account
   * @param {Object} params - Link parameters
   * @returns {Promise<Object>} Bank account record
   */
  async linkWallet(params) {
    const { bankAccountId, holderName, walletAddress } = params;

    try {
      // Validate wallet address format
      if (walletAddress && !ethers.isAddress(walletAddress)) {
        throw new Error('Invalid wallet address format');
      }

      // Find or create bank account
      let bankAccount = await BankAccount.findOne({ bankAccountId });

      if (bankAccount) {
        // Update existing account
        bankAccount.holderName = holderName || bankAccount.holderName;
        bankAccount.linkedWallet = walletAddress || bankAccount.linkedWallet;
        await bankAccount.save();
      } else {
        // Create new account
        bankAccount = new BankAccount({
          bankAccountId,
          holderName,
          linkedWallet: walletAddress
        });
        await bankAccount.save();
      }

      return {
        success: true,
        bankAccount: {
          bankAccountId: bankAccount.bankAccountId,
          holderName: bankAccount.holderName,
          linkedWallet: bankAccount.linkedWallet,
          status: bankAccount.status
        }
      };
    } catch (error) {
      console.error('Error linking wallet:', error);
      throw error;
    }
  }

  /**
   * Freeze a bank account
   * @param {Object} params - Freeze parameters
   * @returns {Promise<Object>} Updated bank account
   */
  async freezeAccount(params) {
    const { bankAccountId, reason, frozenBy } = params;

    try {
      const bankAccount = await BankAccount.findOne({ bankAccountId });

      if (!bankAccount) {
        throw new Error('Bank account not found');
      }

      if (bankAccount.status === 'FROZEN') {
        throw new Error('Bank account is already frozen');
      }

      // Update status
      bankAccount.status = 'FROZEN';
      bankAccount.freezeReason = reason;
      bankAccount.frozenAt = new Date();
      bankAccount.frozenBy = frozenBy;

      await bankAccount.save();

      // Optionally flag wallet on-chain if linked
      if (bankAccount.linkedWallet && ethers.isAddress(bankAccount.linkedWallet)) {
        try {
          await this.flagWalletOnChain(bankAccount.linkedWallet, reason);
        } catch (error) {
          console.warn('Failed to flag wallet on-chain:', error.message);
          // Continue even if on-chain flagging fails
        }
      }

      // Simulate bank API call (modular for future integration)
      await this.notifyCoreBankingSystemFreeze(bankAccountId, reason);

      return {
        success: true,
        bankAccount: {
          bankAccountId: bankAccount.bankAccountId,
          status: bankAccount.status,
          freezeReason: bankAccount.freezeReason,
          frozenAt: bankAccount.frozenAt,
          linkedWallet: bankAccount.linkedWallet
        }
      };
    } catch (error) {
      console.error('Error freezing account:', error);
      throw error;
    }
  }

  /**
   * Unfreeze a bank account
   * @param {Object} params - Unfreeze parameters
   * @returns {Promise<Object>} Updated bank account
   */
  async unfreezeAccount(params) {
    const { bankAccountId, unfrozenBy } = params;

    try {
      const bankAccount = await BankAccount.findOne({ bankAccountId });

      if (!bankAccount) {
        throw new Error('Bank account not found');
      }

      if (bankAccount.status !== 'FROZEN') {
        throw new Error('Bank account is not frozen');
      }

      // Update status
      bankAccount.status = 'ACTIVE';
      bankAccount.freezeReason = null;
      bankAccount.frozenAt = null;
      bankAccount.frozenBy = null;

      await bankAccount.save();

      // Optionally unflag wallet on-chain if linked
      if (bankAccount.linkedWallet && ethers.isAddress(bankAccount.linkedWallet)) {
        try {
          await this.unflagWalletOnChain(bankAccount.linkedWallet);
        } catch (error) {
          console.warn('Failed to unflag wallet on-chain:', error.message);
          // Continue even if on-chain flagging fails
        }
      }

      // Simulate bank API call
      await this.notifyCoreBankingSystemUnfreeze(bankAccountId);

      return {
        success: true,
        bankAccount: {
          bankAccountId: bankAccount.bankAccountId,
          status: bankAccount.status,
          linkedWallet: bankAccount.linkedWallet
        }
      };
    } catch (error) {
      console.error('Error unfreezing account:', error);
      throw error;
    }
  }

  /**
   * Get bank account by ID
   * @param {string} bankAccountId - Bank account ID
   * @returns {Promise<Object>} Bank account record
   */
  async getAccount(bankAccountId) {
    const bankAccount = await BankAccount.findOne({ bankAccountId });

    if (!bankAccount) {
      throw new Error('Bank account not found');
    }

    return bankAccount;
  }

  /**
   * Get bank account by wallet address
   * @param {string} walletAddress - Wallet address
   * @returns {Promise<Array>} List of linked bank accounts
   */
  async getAccountsByWallet(walletAddress) {
    return await BankAccount.find({ linkedWallet: walletAddress });
  }

  /**
   * Flag wallet on-chain
   * @param {string} walletAddress - Wallet address
   * @param {string} reason - Reason for flagging
   */
  async flagWalletOnChain(walletAddress, reason) {
    try {
      const contract = getContract();
      const tx = await contract.flagWallet(walletAddress, reason);
      console.log(`✅ Wallet flagged on-chain: ${walletAddress}, tx: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      console.error('Error flagging wallet on-chain:', error);
      throw error;
    }
  }

  /**
   * Unflag wallet on-chain
   * @param {string} walletAddress - Wallet address
   */
  async unflagWalletOnChain(walletAddress) {
    try {
      const contract = getContract();
      const tx = await contract.unflagWallet(walletAddress);
      console.log(`✅ Wallet unflagged on-chain: ${walletAddress}, tx: ${tx.hash}`);
      return tx.hash;
    } catch (error) {
      console.error('Error unflagging wallet on-chain:', error);
      throw error;
    }
  }

  /**
   * Simulate bank API notification (modular for future integration)
   * @param {string} bankAccountId - Bank account ID
   * @param {string} reason - Freeze reason
   */
  async notifyCoreBankingSystemFreeze(bankAccountId, reason) {
    // TODO: Integrate with real bank API
    console.log(`[SIMULATION] Freezing bank account in core system: ${bankAccountId}, reason: ${reason}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      message: 'Bank account frozen in core system (simulated)'
    };
  }

  /**
   * Simulate bank API notification (modular for future integration)
   * @param {string} bankAccountId - Bank account ID
   */
  async notifyCoreBankingSystemUnfreeze(bankAccountId) {
    // TODO: Integrate with real bank API
    console.log(`[SIMULATION] Unfreezing bank account in core system: ${bankAccountId}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      success: true,
      message: 'Bank account unfrozen in core system (simulated)'
    };
  }
}

module.exports = new BankService();

