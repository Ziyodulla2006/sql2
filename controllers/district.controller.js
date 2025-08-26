const db = require("../config/db.config");

const createDistrict = (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO district (name) VALUES (?)", [name], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, message: "District created" });
  });
};

const getDistricts = (req, res) => {
  db.query("SELECT * FROM district", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

const getDistrict = (req, res) => {
  db.query(
    "SELECT * FROM district WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (!result.length)
        return res.status(404).json({ message: "District not found" });
      res.json(result[0]);
    }
  );
};

const updateDistrict = (req, res) => {
  const fields = req.body;
  const keys = Object.keys(fields);

  if (!keys.length)
    return res.status(400).json({ message: "Nothing to update" });

  const setClause = keys.map((k) => `${k}=?`).join(", ");
  const values = keys.map((k) => fields[k]);

  const sql = `UPDATE district SET ${setClause} WHERE id=?`;

  db.query(sql, [...values, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({
      message: "District updated",
      affectedRows: result.affectedRows,
    });
  });
};

const deleteDistrict = (req, res) => {
  db.query(
    "DELETE FROM district WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({
        message: "District deleted",
        affectedRows: result.affectedRows,
      });
    }
  );
};

module.exports = {
  createDistrict,
  getDistricts,
  getDistrict,
  updateDistrict,
  deleteDistrict,
};