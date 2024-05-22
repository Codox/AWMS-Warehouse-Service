// Connect to the admin database
db = db.getSiblingDB('admin');

// Create application user with readWrite access to awms-be database
db.createUser({
    user: "awms-be",
    pwd: "awms-be",
    roles: [{ role: "readWrite", db: "awms-be" }]
});