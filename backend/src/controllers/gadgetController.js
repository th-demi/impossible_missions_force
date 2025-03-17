const Gadget = require('../models/gadget');
const { 
  generateCodename, 
  generateSuccessProbability, 
  generateSelfDestructCode 
} = require('../utils/codeGenerator');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { Op } = require('sequelize');

/**
 * Get all gadgets with optional status filter
 */
const getAllGadgets = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    let gadgets = await Gadget.findAll({ 
      where: filter,
      order: [['createdAt', 'DESC']]
    });
    
    // Add mission success probability to each gadget
    gadgets = gadgets.map(gadget => {
      const gadgetJson = gadget.toJSON();
      const probability = generateSuccessProbability();
      
      return {
        ...gadgetJson,
        successProbability: probability,
        statusDisplay: `${gadget.codename} - ${probability}% success probability`
      };
    });
    
    return res.json(successResponse(gadgets, 'Gadgets retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific gadget by ID
 */
const getGadgetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const gadget = await Gadget.findByPk(id);
    
    if (!gadget) {
      return res.status(404).json(errorResponse('Gadget not found', 404));
    }
    
    const gadgetJson = gadget.toJSON();
    const probability = generateSuccessProbability();
    
    return res.json(successResponse({
      ...gadgetJson,
      successProbability: probability,
      statusDisplay: `${gadget.codename} - ${probability}% success probability`
    }));
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new gadget
 */
const createGadget = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    // Validate input
    if (!name) {
      return res.status(400).json(errorResponse('Gadget name is required', 400));
    }
    
    // Generate unique codename
    let codename;
    let isUnique = false;
    
    while (!isUnique) {
      codename = generateCodename();
      // Check if codename already exists
      const existing = await Gadget.findOne({ where: { codename } });
      if (!existing) {
        isUnique = true;
      }
    }
    
    // Create new gadget
    const gadget = await Gadget.create({
      name,
      codename,
      description,
      status: 'Available'
    });
    
    return res.status(201).json(successResponse(gadget, 'Gadget created successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing gadget
 */
const updateGadget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    
    // Find gadget
    const gadget = await Gadget.findByPk(id);
    
    if (!gadget) {
      return res.status(404).json(errorResponse('Gadget not found', 404));
    }
    
    // Validate status if provided
    if (status && !['Available', 'Deployed', 'Destroyed', 'Decommissioned'].includes(status)) {
      return res.status(400).json(errorResponse('Invalid status value', 400));
    }
    
    // Update gadget
    await gadget.update({
      name: name || gadget.name,
      description: description !== undefined ? description : gadget.description,
      status: status || gadget.status
    });
    
    return res.json(successResponse(gadget, 'Gadget updated successfully'));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a gadget (mark as decommissioned)
 */
const deleteGadget = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find gadget
    const gadget = await Gadget.findByPk(id);
    
    if (!gadget) {
      return res.status(404).json(errorResponse('Gadget not found', 404));
    }
    
    // Mark as decommissioned instead of deleting
    await gadget.update({
      status: 'Decommissioned',
      decommissionedAt: new Date()
    });
    
    return res.json(successResponse(
      { id: gadget.id, status: gadget.status, decommissionedAt: gadget.decommissionedAt },
      'Gadget decommissioned successfully'
    ));
  } catch (error) {
    next(error);
  }
};

/**
 * Trigger self-destruct for a specific gadget
 */
const selfDestructGadget = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { confirmationCode } = req.body;
    
    // Find gadget
    const gadget = await Gadget.findByPk(id);
    
    if (!gadget) {
      return res.status(404).json(errorResponse('Gadget not found', 404));
    }
    
    // Check if gadget is already destroyed or decommissioned
    if (['Destroyed', 'Decommissioned'].includes(gadget.status)) {
      return res.status(400).json(
        errorResponse(`Gadget cannot be destroyed. Current status: ${gadget.status}`, 400)
      );
    }
    
    // Generate expected confirmation code (in a real app, this would be sent to the user)
    const expectedCode = generateSelfDestructCode();
    
    // In a real app, we would check if the provided code matches the expected one
    // For this exercise, we'll simulate a successful confirmation
    // if (confirmationCode !== expectedCode) {
    //   return res.status(400).json(errorResponse('Invalid confirmation code', 400));
    // }
    
    // Update gadget status to Destroyed
    await gadget.update({
      status: 'Destroyed'
    });
    
    return res.json(successResponse({
      id: gadget.id,
      codename: gadget.codename,
      status: gadget.status,
      message: `${gadget.codename} has been successfully destroyed.`,
      confirmationCode: expectedCode // In a real app, this would be sent separately
    }, 'Self-destruct sequence completed'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllGadgets,
  getGadgetById,
  createGadget,
  updateGadget,
  deleteGadget,
  selfDestructGadget
};