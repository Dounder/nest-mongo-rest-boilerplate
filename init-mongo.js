db.createUser({
  user: process.env.DB_USERNAME || 'mongo',
  pwd: process.env.DB_PASSWORD || 'password',
  roles: [
    {
      role: 'readWrite',
      db: process.env.DB_NAME || 'example',
    },
  ],
});
