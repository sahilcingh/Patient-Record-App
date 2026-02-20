import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Bearer <token>

    if (!token) {
        return res.status(403).json({ message: "No token provided. Access denied." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "my_super_secret_key_123");
        req.doctor = decoded; // Save the doctor's info for the next functions
        next(); // Let them pass
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};