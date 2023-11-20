const express = require("express");
const router = express.Router();

const connection = require("./database/users_db");
const bcryptjs = require("bcryptjs");

// Seleccionar todos
router.get("/", (req, res) => {
  connection.query("SELECT * FROM users", (error, result) => {
    res.render("index", { api: result });
  });
});

// Nuevo registro GET
router.get("/register", (req, res) => {
  res.render("register");
});

// Nuevo registro POST
router.post("/register", async (req, res) => {
  const { user, name, rol, pass } = req.body;
  let passwordHash = await bcryptjs.hash(pass, 8);

  if (user && pass) {
    connection.query(
      "SELECT * FROM users WHERE user = ?",
      [user],
      async (error, results) => {
        if (results.length == 0) {
          connection.query(
            "insert into users set ?",
            { user: user, name: name, rol: rol, pass: passwordHash },
            async (error, result) => {
              res.render("login", {
                alert: true,
                alertTitle: "Registration",
                alertMessage: "Successfull Registration",
                alertIcon: "success",
                showConfirmButton: false,
                timer: 1500,
                ruta: "login",
              });
            }
          );
        } else {
          res.render("login", {
            alert: true,
            alertTitle: "Error",
            alertMessage: "El Usuario ya existe!",
            alertIcon: "error",
            showConfirmButton: true,
            timer: 2500,
            ruta: "login",
          });
        }
      }
    );
  }
});

// Editar Registro
router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("edit", { api: results[0] });
      }
    }
  );
});

// Editar Registro POST
router.post("/update", (req, res) => {
  const id = req.body.id;
  const user = req.body.user;
  const name = req.body.name;
  const rol = req.body.rol;
  /* const pass = req.body.pass; */
  connection.query(
    "UPDATE users SET ? WHERE id = ?",
    [{ user: user, name: name, rol: rol }, id],
    (error, results) => {
      res.redirect("/");
    }
  );
});

// Eliminar Registro (Confirmar)
router.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.render("delete", { api: results });
      }
    }
  );
});

// Eliminar Registro (Acción)
router.get("/del/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM users WHERE id = ?", [id], (error, results) => {
    if (error) {
      throw error;
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
