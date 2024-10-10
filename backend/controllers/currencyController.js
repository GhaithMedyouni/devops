const Currency = require('../models/appmodel/Currency');

// Create a new currency
exports.createCurrency = async (req, res) => {
  const { name, code, symbol, createdBy } = req.body;

  try {
    const newCurrency = new Currency({
      name,
      code,
      symbol,
      
      createdBy,
    });

    const savedCurrency = await newCurrency.save();
    res.status(201).json(savedCurrency);
  } catch (error) {
    res.status(500).json({ message: 'Error creating currency', error });
  }
};

// Get all currencies or filter by createdBy
exports.getCurrencies = async (req, res) => {
    const { createdBy, active } = req.query;

  try {
    const filter = {};

    if (createdBy) {
      filter.createdBy = createdBy;
    }

    if (active !== undefined) {
      filter.active = active === 'true';
    }
    const currencies = await Currency.find(filter);
    res.status(200).json(currencies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching currencies', error });
  }
};

// Get a single currency by ID
exports.getCurrencyById = async (req, res) => {
  const { id } = req.params;

  try {
    const currency = await Currency.findById(id);
    if (!currency) return res.status(404).json({ message: 'Currency not found' });

    res.status(200).json(currency);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching currency', error });
  }
};

// Update a currency by ID
exports.updateCurrency = async (req, res) => {
  const { id } = req.params;
  const { name, code, symbol, symbolPosition, decimalSeparator, thousandSeparator, precision, zeroFormat, active } = req.body;

  try {
    const updatedCurrency = await Currency.findByIdAndUpdate(
      id,
      { name, code, symbol, symbolPosition, decimalSeparator, thousandSeparator, precision, zeroFormat, active },
      { new: true }
    );

    if (!updatedCurrency) return res.status(404).json({ message: 'Currency not found' });

    res.status(200).json(updatedCurrency);
  } catch (error) {
    res.status(500).json({ message: 'Error updating currency', error });
  }
};

// Delete a currency by ID
exports.deleteCurrency = async (req, res) => {
  const { id } = req.params;

  try {
    const currency = await Currency.findByIdAndDelete(id);
    if (!currency) return res.status(404).json({ message: 'Currency not found' });

    res.status(200).json({ message: 'Currency deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting currency', error });
  }
};
