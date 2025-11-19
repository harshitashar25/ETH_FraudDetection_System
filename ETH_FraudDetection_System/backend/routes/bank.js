const express = require('express');
const router = express.Router();
const bankService = require('../services/bankService');

/**
 * POST /api/bank/link-wallet
 * Link a wallet address to a bank account
 */
router.post('/link-wallet', async (req, res) => {
  try {
    const { bankAccountId, holderName, walletAddress } = req.body;

    if (!bankAccountId) {
      return res.status(400).json({ error: 'bankAccountId is required' });
    }

    const result = await bankService.linkWallet({
      bankAccountId,
      holderName,
      walletAddress
    });

    res.json(result);
  } catch (error) {
    console.error('Error in /api/bank/link-wallet:', error);
    res.status(500).json({
      error: 'Failed to link wallet',
      message: error.message
    });
  }
});

/**
 * POST /api/bank/freeze
 * Freeze a bank account
 */
router.post('/freeze', async (req, res) => {
  try {
    const { bankAccountId, reason, frozenBy } = req.body;

    if (!bankAccountId || !reason) {
      return res.status(400).json({ 
        error: 'bankAccountId and reason are required' 
      });
    }

    const result = await bankService.freezeAccount({
      bankAccountId,
      reason,
      frozenBy: frozenBy || req.headers['x-user-id'] || 'system'
    });

    res.json(result);
  } catch (error) {
    console.error('Error in /api/bank/freeze:', error);
    res.status(500).json({
      error: 'Failed to freeze account',
      message: error.message
    });
  }
});

/**
 * POST /api/bank/unfreeze
 * Unfreeze a bank account
 */
router.post('/unfreeze', async (req, res) => {
  try {
    const { bankAccountId, unfrozenBy } = req.body;

    if (!bankAccountId) {
      return res.status(400).json({ error: 'bankAccountId is required' });
    }

    const result = await bankService.unfreezeAccount({
      bankAccountId,
      unfrozenBy: unfrozenBy || req.headers['x-user-id'] || 'system'
    });

    res.json(result);
  } catch (error) {
    console.error('Error in /api/bank/unfreeze:', error);
    res.status(500).json({
      error: 'Failed to unfreeze account',
      message: error.message
    });
  }
});

/**
 * GET /api/bank/:bankAccountId
 * Get bank account details
 */
router.get('/:bankAccountId', async (req, res) => {
  try {
    const { bankAccountId } = req.params;
    const bankAccount = await bankService.getAccount(bankAccountId);

    res.json({
      success: true,
      bankAccount: {
        bankAccountId: bankAccount.bankAccountId,
        holderName: bankAccount.holderName,
        linkedWallet: bankAccount.linkedWallet,
        status: bankAccount.status,
        freezeReason: bankAccount.freezeReason,
        frozenAt: bankAccount.frozenAt,
        createdAt: bankAccount.createdAt
      }
    });
  } catch (error) {
    console.error('Error in /api/bank/:bankAccountId:', error);
    res.status(404).json({
      error: 'Bank account not found',
      message: error.message
    });
  }
});

/**
 * GET /api/bank/wallet/:walletAddress
 * Get all bank accounts linked to a wallet
 */
router.get('/wallet/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const accounts = await bankService.getAccountsByWallet(walletAddress);

    res.json({
      success: true,
      walletAddress,
      count: accounts.length,
      accounts: accounts.map(acc => ({
        bankAccountId: acc.bankAccountId,
        holderName: acc.holderName,
        status: acc.status,
        freezeReason: acc.freezeReason,
        frozenAt: acc.frozenAt
      }))
    });
  } catch (error) {
    console.error('Error in /api/bank/wallet/:walletAddress:', error);
    res.status(500).json({
      error: 'Failed to fetch accounts',
      message: error.message
    });
  }
});

module.exports = router;

