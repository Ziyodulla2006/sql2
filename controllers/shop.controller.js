const db = require("../config/db.config");

const createShop = (req, res) => {
  const { name, owner_id, phone_number, district_id, address, location } =
    req.body;
  const sql = `INSERT INTO shop (name, owner_id, phone_number, district_id, address, location)
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [name, owner_id, phone_number, district_id, address, location],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: result.insertId, message: "Shop created" });
    }
  );
};


const getShops = (req, res) => {
  const sql = `SELECT s.*, u.name as owner_name, d.name as district_name
               FROM shop s
               LEFT JOIN user u ON s.owner_id = u.id
               LEFT JOIN district d ON s.district_id = d.id`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

const getShop = (req, res) => {
  const sql = `SELECT s.*, u.name as owner_name, d.name as district_name
               FROM shop s
               LEFT JOIN user u ON s.owner_id = u.id
               LEFT JOIN district d ON s.district_id = d.id
               WHERE s.id=?`;
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (!result.length)
      return res.status(404).json({ message: "Shop not found" });
    res.json(result[0]);
  });
};


const updateShop = (req, res) => {
  const fields = req.body;
  const keys = Object.keys(fields);

  if (!keys.length)
    return res.status(400).json({ message: "Nothing to update" });

  const setClause = keys.map((k) => `${k}=?`).join(", ");
  const values = keys.map((k) => fields[k]);

  const sql = `UPDATE shop SET ${setClause} WHERE id=?`;

  db.query(sql, [...values, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Shop updated", affectedRows: result.affectedRows });
  });
};

const deleteShop = (req, res) => {
  db.query("DELETE FROM shop WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Shop deleted", affectedRows: result.affectedRows });
  });
};

module.exports = { createShop, getShops, getShop, updateShop, deleteShop };