router.post('/login',
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        try {
            const { rows } = await dbContext.query('SELECT id,password FROM users WHERE email = $1', [email])
            const compared = await comparePasswords(password, rows[0].password);
            if (compared) {
                const { SECRET_KEY } = process.env;
                const userId = rows[0].id;
                const token = await signToken(userId + "", SECRET_KEY);
                return res.status(200).json({ token: token,userId:userId });
            } else {
                return res.status(401).json({ message: "bad credentials" });
            }
        } catch (err) {
            return res.status(401).json(err);
        }
    }
);