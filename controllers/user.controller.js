const db = require("../config/db.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const registerUser = (req, res) => {
  const { name, phone_number, email, password, role, address } = req.body;

  if (!name || !phone_number || !email || !password || !role || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const checkQuery = "SELECT * FROM user WHERE email = ? OR phone_number = ?";
  db.query(checkQuery, [email, phone_number], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const insertQuery = `
      INSERT INTO user (name, phone_number, email, password, is_active, role, address) 
      VALUES (?, ?, ?, ?, 1, ?, ?)
    `;
    db.query(
      insertQuery,
      [name, phone_number, email, hashedPassword, role, address],
      (err, result) => {
        if (err) return res.status(500).json({ message: err.message });

        res.status(201).json({
          message: "User registered successfully",
          userId: result.insertId,
        });
      }
    );
  });
};


const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const getQuery = "SELECT * FROM user WHERE email = ?";
  db.query(getQuery, [email], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!result.length)
      return res.status(401).json({ message: "User not found" });

    const user = result[0];

    const validPass = bcrypt.compareSync(password, user.password);
    if (!validPass)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET_KEY || "nimadur",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
};

const getUsers = (req, res) => {
  const query = "SELECT id, name, email, phone_number, role, is_active, address FROM user";
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(200).json(result);
  });
};


const getUser = (req, res) => {
  const id = req.params.id;
  const query = "SELECT id, name, email, phone_number, role, is_active, address FROM user WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!result.length)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json(result[0]);
  });
};


const updateUser = (req, res) => {
  const fields = req.body;
  const keys = Object.keys(fields);

  if (!keys.length) return res.status(400).json({ message: "Nothing to update" });

  const setClause = keys.map(k => `${k}=?`).join(", ");
  const values = keys.map(k => fields[k]);

  const sql = `UPDATE user SET ${setClause} WHERE id=?`;

  db.query(sql, [...values, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "User updated", affectedRows: result.affectedRows });
  });
};



const deleteUser = (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM user WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};