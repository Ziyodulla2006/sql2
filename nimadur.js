const db = require("../config/db.config");

// Create
const createGasStationFuelType = (req, res) => {
  const { gas_station_branch_id, fuel_type_id, price, is_exists } = req.body;
  const query = `
    INSERT INTO gas_station_fuel_type (gas_station_branch_id, fuel_type_id, price, is_exists)
    VALUES (?, ?, ?, ?)
  `;
  db.query(
    query,
    [gas_station_branch_id, fuel_type_id, price, is_exists],
    (error, results) => {
      if (error)
        return res
          .status(500)
          .json({ message: "Error adding Gas Station Fuel Type" });
      res
        .status(201)
        .json({
          statusCode: 201,
          message: "Gas Station Fuel Type added",
          id: results.insertId,
        });
    }
  );
};

// Get all
const getGasStationFuelTypes = (req, res) => {
  db.query(`SELECT * FROM gas_station_fuel_type`, (error, result) => {
    if (error)
      return res
        .status(500)
        .json({ message: "Error retrieving Gas Station Fuel Types" });
    res.json({
      statusCode: 200,
      message: "Gas Station Fuel Types retrieved successfully",
      data: result,
    });
  });
};

// Get one
const getOneGasStationFuelType = (req, res) => {
  const { id } = req.params;
  db.query(
   `SELECT * FROM gas_station_fuel_type WHERE id = ?`,
    [id],
    (error, result) => {
      if (error)
        return res
          .status(500)
          .json({ message: "Error retrieving Gas Station Fuel Type" });
      if (!result.length)
        return res
          .status(404)
          .json({ message: "Gas Station Fuel Type not found" });
      res.json({
        statusCode: 200,
        message: "Gas Station Fuel Type retrieved successfully",
        data: result[0],
      });
    }
  );
};

// Update
const updateGasStationFuelType = (req, res) => {
  const { id } = req.params;
  const { gas_station_branch_id, fuel_type_id, price, is_exists } = req.body;
  const query = `
    UPDATE gas_station_fuel_type SET gas_station_branch_id=?, fuel_type_id=?, price=?, is_exists=? WHERE id=?
  `;
  db.query(
    query,
    [gas_station_branch_id, fuel_type_id, price, is_exists, id],
    (error, result) => {
      if (error)
        return res
          .status(500)
          .json({ message: "Error updating Gas Station Fuel Type" });
      res.json({
        statusCode: 200,
        message: "Gas Station Fuel Type updated successfully",
        affected: result.affectedRows,
      });
    }
  );
};

// Delete
const deleteGasStationFuelType = (req, res) => {
  const { id } = req.params;
  db.query(
    `DELETE FROM gas_station_fuel_type WHERE id = ?`,
    [id],
    (error, result) => {
      if (error)
        return res
          .status(500)
          .json({ message: "Error deleting Gas Station Fuel Type" });
      res.json({
        statusCode: 200,
        message: "Gas Station Fuel Type deleted successfully",
        affected: result.affectedRows,
      });
    }
  );
};

module.exports = {
  createGasStationFuelType,
  getGasStationFuelTypes,
  getOneGasStationFuelType,
  updateGasStationFuelType,
  deleteGasStationFuelType,
};