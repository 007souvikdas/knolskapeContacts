class UpdateConditionsNotFoundException extends Error {
    constructor() {
        super('Update conditions failed');
    }
}

class DatabaseException extends Error {
    constructor() {
        super('Database error');
    }
}

module.exports = {
    DatabaseException,
    UpdateConditionsNotFoundException,
};
