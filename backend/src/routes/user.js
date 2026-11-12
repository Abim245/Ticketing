import user from "../controllers/auth.js";

app.post("/register", user.register);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});