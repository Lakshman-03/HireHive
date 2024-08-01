import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
    user: "postgres",
    database: "HireHive",
    port: 5432,
    host: "localhost",
    password: "Lakshman@123"
});

db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/service-categories", (req, res) => {
    res.render("service-categories.ejs");
});

app.get("/booking", (req, res) => {
    res.render("booking.ejs");
});

app.get("/review", (req, res) => {
    res.render("review.ejs");
});

app.get("/about",(req,res) =>
{
    res.render("about.ejs");
});
app.get("/logout",(req,res)=>{
    res.redirect("/")
})
app.get("/requests",(req,res) => { 
    res.render("requests.ejs");
});
app.post("/signup", (req, res) => {
    const { username, email, password, userType, location, proServices } = req.body;

    let query;
    let values;

    if (userType === "user") {
        query = "INSERT INTO users (username, email, password, location) VALUES ($1, $2, $3, $4)";
        values = [username, email, password, location];
    } else if (userType === "professional") {
        query = "INSERT INTO professionals (ownername, email, password, location, service) VALUES ($1, $2, $3, $4, $5)";
        values = [username, email, password, location, proServices];
    } else {
        return res.status(400).send("Invalid user type");
    }

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);
            res.status(500).send("Error inserting user");
        } else {
            console.log("User inserted successfully");
            res.status(200).send("User inserted successfully");
        }
    });
});

app.get("/professional-dashboard", (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).send("Professional ID is required");
    }

    db.query("SELECT ownername, service, rating, location, price FROM professionals WHERE p_id = $1", [id], (err, result) => {
        if (err) {
            console.error("Error querying professional:", err);
            res.status(500).send("Error querying professional");
        } else {
            if (result.rows.length === 0) {
                res.status(404).send("Professional not found");
            } else {
                res.render("professional-dashboard.ejs", { professional: result.rows[0] });
            }
        }
    });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE email = $1 AND password = $2",
        [email, password],
        (err, userResult) => {
            if (err) {
                console.error("Error querying user:", err);
                res.status(500).send("Error querying user");
            } else {
                if (userResult.rows.length > 0) {
                    res.render("index.ejs");
                } else {
                    db.query(
                        "SELECT * FROM professionals WHERE email = $1 AND password = $2",
                        [email, password],
                        (err, professionalResult) => {
                            if (err) {
                                console.error("Error querying professional:", err);
                                res.status(500).send("Error querying professional");
                            } else {
                                if (professionalResult.rows.length > 0) {
                                    const professionalId = professionalResult.rows[0].p_id;
                                    res.redirect(`/professional-dashboard?id=${professionalId}`);
                                } else {
                                    res.status(401).send("Invalid email or password");
                                }
                            }
                        }
                    );
                }
            }
        }
    );
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
