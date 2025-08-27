import pool from "../config/db.js";


export const createUser = async ({
    firstname,
    lastname,
    brandname = null,
    email,
    password_hash,
    role = "buyer",
    logo_url = null,
    is_verified = 0,
    verification_token = null,
    verification_expires = null,
    }) => {
        const [result] = await pool.execute(`INSERT INTO users (firstname, lastname, brandname, email, password_hash, role, logo_url, is_verified, verification_token, verification_expires) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                firstname,
                lastname,
                role === "seller" ? brandname : null,
                email.toLowerCase(),
                password_hash,
                role,
                role === "seller" ? logo_url : null,  
                is_verified,
                verification_token,
                verification_expires,
            ]
        );
        return result.insertId;
};
  

export const getUserByEmail = async (email) => {
    const [rows] = await pool.execute(`SELECT * FROM users WHERE email = ? LIMIT 1`, [(email || "").toLowerCase(),]); 
    return rows[0] || null;
};

export const getUserById = async (id) => {
    const [rows] = await pool.execute(`SELECT id, firstname, lastname, brandname, email, role, logo_url, is_verified, created_at, updated_at FROM users WHERE id = ?`, [id]);
    return rows[0] || null;
};


export const getAllUsers = async () => {
    const [rows] = await pool.execute(`SELECT id, firstname, lastname, brandname, email, role, logo_url, is_verified, created_at FROM users ORDER BY id DESC`);
    return rows;
};

export const updateUserById = async (id, { firstname, lastname, email, role }) => {
    const sql = `UPDATE users SET firstname = ?, lastname = ?, email = ?, role = ? WHERE id = ?`;
    const [result] = await pool.execute(sql, [
        firstname,
        lastname,
        email.toLowerCase(),
        role,
        id
    ]);
    return result;
};
  

export const setVerified = async (id, verified = true) => {
    await pool.execute(
        `UPDATE users SET is_verified = ?, verification_token = NULL, verification_expires = NULL WHERE id = ?`,[verified ? 1 : 0, id]
    );
};

export const deleteUserById = async (id) => {
    await pool.execute(`DELETE FROM users WHERE id = ?`, [id]);
};
