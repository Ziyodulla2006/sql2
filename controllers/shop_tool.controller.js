const db = require("../config/db.config");

const createShopTool = (req, res) => {
  const { shop_id, tool_id, rent_price } = req.body;
  db.query(
    "INSERT INTO shop_tool (shop_id, tool_id, rent_price) VALUES (?, ?, ?)",
    [shop_id, tool_id, rent_price],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res
        .status(201)
        .json({ id: result.insertId, message: "ShopTool created" });
    }
  );
};

const getShopTools = (req, res) => {
  const sql = `SELECT st.*, s.name as shop_name, t.name as tool_name
               FROM shop_tool st
               LEFT JOIN shop s ON st.shop_id = s.id
               LEFT JOIN tool t ON st.tool_id = t.id`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};


const getShopTool = (req, res) => {
  const sql = `SELECT st.*, s.name as shop_name, t.name as tool_name
               FROM shop_tool st
               LEFT JOIN shop s ON st.shop_id = s.id
               LEFT JOIN tool t ON st.tool_id = t.id
               WHERE st.id=?`;
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (!result.length)
      return res.status(404).json({ message: "ShopTool not found" });
    res.json(result[0]);
  });
};

const updateShopTool = (req, res) => {
  const fields = req.body;
  const keys = Object.keys(fields);

  if (!keys.length)
    return res.status(400).json({ message: "Nothing to update" });

  const setClause = keys.map((k) => `${k}=?`).join(", ");
  const values = keys.map((k) => fields[k]);

  const sql = `UPDATE shop_tool SET ${setClause} WHERE id=?`;

  db.query(sql, [...values, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({
      message: "Shop tool updated",
      affectedRows: result.affectedRows,
    });
  });
};


const deleteShopTool = (req, res) => {
  db.query(
    "DELETE FROM shop_tool WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({
        message: "ShopTool deleted",
        affectedRows: result.affectedRows,
      });
    }
  );
};

module.exports = {
  createShopTool,
  getShopTools,
  getShopTool,
  updateShopTool,
  deleteShopTool,
};