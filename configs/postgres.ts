type MainConfig = {
    USER?: string;
    DATABASE?: string;
    PASSWORD?: string;
    PORT?: number;
    HOST?: string;
    MAX_POOL?: number;
    APPLICATION_NAME?: string;
};

const main: MainConfig = {};

main.USER = process.env.MAIN_PSQL_USER;
main.DATABASE = process.env.MAIN_PSQL_DATABASE;
main.PASSWORD = process.env.MAIN_PSQL_PASSWORD;
main.PORT = process.env.MAIN_PSQL_PORT ? Number(process.env.MAIN_PSQL_PORT) : undefined;
main.HOST = process.env.MAIN_PSQL_HOST;
main.MAX_POOL = process.env.MAIN_PSQL_MAX_POOL ? Number(process.env.MAIN_PSQL_MAX_POOL) : 20;
main.APPLICATION_NAME = process.env.MAIN_PSQL_APPLICATION_NAME;

export { main };
