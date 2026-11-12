import User from "../models/user.js";

const register = async (req, res) => {
    const { name, email } = req.body;
    const user = new User({ name, email });
    await user.save();
    res.status(201).json(user);

    if (!name || !email){
        return res.status(400).json({ error: "Name and email are required" });
    }
}

export default { register };