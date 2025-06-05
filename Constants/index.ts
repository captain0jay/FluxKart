interface ContactsLinkPrecedence {
    PRIMARY: string;
    SECONDARY: string;
}

interface ContactsModels {
    LINK_PRECEDENCE: ContactsLinkPrecedence;
}

interface DBModels {
    CONTACTS: ContactsModels;
}

interface DB {
    MODELS: DBModels;
}

interface Constants {
    DB: DB;
}

const Constants: Constants = {
    DB: {
        MODELS: {
            CONTACTS: {
                LINK_PRECEDENCE: {
                    PRIMARY: 'primary',
                    SECONDARY: 'secondary'
                }
            }
        }
    }
};

export default Constants;