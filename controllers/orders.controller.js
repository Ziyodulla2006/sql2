const db = require("../config/db.config");


const createOrder = (req, res) => {
  const { client_id, shop_tool_id, order_date, period } = req.body;

  const sqlPrice = `
    SELECT st.rent_price, t.tool_price
    FROM shop_tool st
    LEFT JOIN tool t ON st.tool_id = t.id
    LEFT JOIN shop s ON st.shop_id = s.id
    WHERE st.id = ?
  `;

  db.query(sqlPrice, [shop_tool_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (!result.length)
      return res.status(404).json({ message: "ShopTool not found" });

    const { rent_price, tool_price } = result[0];
    const total_price = (Number(rent_price) + Number(tool_price)) * period;

    const sql = `
      INSERT INTO orders (client_id, shop_tool_id, order_date, period, total_price)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [client_id, shop_tool_id, order_date, period, total_price],
      (err2, result2) => {
        if (err2) return res.status(500).json({ error: err2 });

        res.status(201).json({
          id: result2.insertId,
          message: "Order created",
          total_price,
        });
      }
    );
  });
};


const getOrders = (req, res) => {
  const sql = `SELECT o.*, u.name as client_name, t.name as tool_name, s.name as shop_name
               FROM orders o
               LEFT JOIN user u ON o.client_id = u.id
               LEFT JOIN shop_tool st ON o.shop_tool_id = st.id
               LEFT JOIN tool t ON st.tool_id = t.id
               LEFT JOIN shop s ON st.shop_id = s.id`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

const getOrder = (req, res) => {
  const sql = `SELECT o.*, u.name as client_name, t.name as tool_name, s.name as shop_name
               FROM orders o
               LEFT JOIN user u ON o.client_id = u.id
               LEFT JOIN shop_tool st ON o.shop_tool_id = st.id
               LEFT JOIN tool t ON st.tool_id = t.id
               LEFT JOIN shop s ON st.shop_id = s.id
               WHERE o.id=?`;
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (!result.length)
      return res.status(404).json({ message: "Order not found" });
    res.json(result[0]);
  });
};


const updateOrder = (req, res) => {
  const fields = req.body;
  const keys = Object.keys(fields);

  if (!keys.length)
    return res.status(400).json({ message: "Nothing to update" });

  const setClause = keys.map((k) => `${k}=?`).join(", ");
  const values = keys.map((k) => fields[k]);

  const sql = `UPDATE orders SET ${setClause} WHERE id=?`;

  db.query(sql, [...values, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Order updated", affectedRows: result.affectedRows });
  });
};


const deleteOrder = (req, res) => {
  db.query("DELETE FROM orders WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Order deleted", affectedRows: result.affectedRows });
  });
};

module.exports = { createOrder, getOrders, getOrder, updateOrder, deleteOrder };