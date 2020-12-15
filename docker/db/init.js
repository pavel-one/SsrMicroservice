db.createUser(
    {
        user: "ssr",
        pwd: "ssr",
        roles: [
            {
                role: "readWrite",
                db: "ssr"
            }
        ]
    }
);