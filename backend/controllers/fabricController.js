const Fabric = require('../models/fabric');

const addFabric = async (req, res) => {
    const { nom, description, origine, image, proprietes, entretien, utilisations } = req.body;
    try {
        const fabric = await Fabric.create({ nom, description, origine, image, proprietes, entretien, utilisations });
        res.status(201).json(fabric);
    } catch (err) {
        res.status(400).json({ message: 'Erreur lors de l\'ajout de la matière' });
    }
};

const getAllFabrics = async (req, res) => {
    try {
        const fabrics = await Fabric.findAll();
        res.json(fabrics);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des matières' });
    }
};

module.exports = { addFabric, getAllFabrics };
