const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

const connection = mysql.createConnection({
    host:"localhost",
    port: 3307,
    user:"root",
    password:"",
    database:"raktar_db"
})

connection.connect((err)=> {
    if (err) {
        console.error("nem jo:", err);
        return;
    }

    console.log("jo a kapcsolat");



});


app.get("/termekek", (req, res) => {
    const sql = `
        SELECT termekek.id, termekek.nev, termekek.ar, kategoriak.nev AS kategoria
        FROM termekek INNER JOIN kategoriak
        ON termekek.kategoria_id = kategoriak.id
        ORDER BY termekek.ar ASC
    `;

    connection.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

app.get("/termekek/elerheto", (req, res) => {
    const sql = `
        SELECT termekek.id, termekek.nev, termekek.ar, termekek.darabszam, kategoriak.nev AS kategoria
        FROM termekek INNER JOIN kategoriak  ON termekek.kategoria_id = kategoriak.id
        WHERE termekek.elerheto = 1 AND termekek.darabszam > 0
        ORDER BY termekek.ar ASC
    `;

    connection.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

app.get("/termekek/kereses/:szoveg", (req, res) => {
    const sql = "SELECT * FROM termekek WHERE nev LIKE ?";

    connection.query(sql, [`%${req.params.szoveg}%`], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);
    });
});

app.get("/termekek/statisztika", (req, res) => {
    const sql = ` SELECT kategoriak.nev AS kategoria,
                  COUNT(termekek.id) AS darabszam, ROUND(AVG(termekek.ar)) AS atlagar
                  FROM termekek JOIN kategoriak ON termekek.kategoria_id = kategoriak.id
                  GROUP BY kategoriak.nev
    `;

    connection.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});


app.get("/termekek/dragak", (req, res) => {
    const sql = "SELECT nev, egysegar, keszlet FROM termekek WHERE egysegar > 10000 ORDER BY keszlet DESC";

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);
    });
});


app.delete("/termekek/:id", (req, res) => {
    const sql = "DELETE FROM termekek WHERE id = ?";

    connection.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});



app.post("/termekek", (req, res) => {
    const sql = "INSERT INTO termekek (nev, ar) VALUES (?, ?)";

    connection.query(
        sql,
        [req.body.nev, req.body.ar],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});


app.put("/termekek/:id", (req, res) => {
    const sql = "UPDATE termekek SET ar = ? WHERE id = ?";

    connection.query(
        sql,
        [req.body.ar, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});


app.delete("/kategoriak/:id", (req, res) => {
    const sql = "DELETE FROM kategoriak WHERE id = ?";

    connection.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});


app.post("/kategoriak", (req, res) => {
    const sql = "INSERT INTO kategoriak (nev) VALUES (?)";

    connection.query(
        sql,
        [req.body.nev],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
})


app.put("/kategoriak/:id", (req, res) => {
    const sql = "UPDATE kategoriak SET nev = ? WHERE id = ?";

    connection.query(
        sql,
        [req.body.nev, req.params.id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});