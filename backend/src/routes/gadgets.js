const express = require('express');
const { 
  getAllGadgets, 
  getGadgetById, 
  createGadget, 
  updateGadget, 
  deleteGadget,
  selfDestructGadget
} = require('../controllers/gadgetController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all gadget routes
router.use(authenticate);

// Get all gadgets (with optional status filter)
router.get('/', getAllGadgets);

// Get a specific gadget
router.get('/:id', getGadgetById);

// Create a new gadget
router.post('/', authorize(['admin']), createGadget);

// Update a gadget
router.patch('/:id', authorize(['admin']), updateGadget);

// Delete a gadget (mark as decommissioned)
router.delete('/:id', authorize(['admin']), deleteGadget);

// Self-destruct a gadget
router.post('/:id/self-destruct', authorize(['admin']), selfDestructGadget);

module.exports = router;