const db = require("../config/db.config");

const createTool = (req, res) => {
  const { name, brand, description, tool_price } = req.body;
  db.query(
    "INSERT INTO tool (name, brand, description, tool_price) VALUES (?, ?, ?, ?)",
    [name, brand, description, tool_price],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ id: result.insertId, message: "Tool created" });
    }
  );
};

const getTools = (req, res) => {
  db.query("SELECT * FROM tool", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

const getTool = (req, res) => {
  db.query("SELECT * FROM tool WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (!result.length)
      return res.status(404).json({ message: "Tool not found" });
    res.json(result[0]);
  });
};

const updateTool = (req, res) => {
  const fields = req.body;
  const keys = Object.keys(fields);

  if (!keys.length)
    return res.status(400).json({ message: "Nothing to update" });

  const setClause = keys.map((k) => `${k}=?`).join(", ");
  const values = keys.map((k) => fields[k]);

  const sql = `UPDATE tool SET ${setClause} WHERE id=?`;

  db.query(sql, [...values, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Tool updated", affectedRows: result.affectedRows });
  });
};


const deleteTool = (req, res) => {
  db.query("DELETE FROM tool WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Tool deleted", affectedRows: result.affectedRows });
  });
};

module.exports = { createTool, getTools, getTool, updateTool, deleteTool };