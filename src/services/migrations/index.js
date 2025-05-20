import { Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage'; // Utiliser SQLite directement, pas "openDatabase as openSQLiteDatabase"

const DATABASE_NAME = "ReactNativetest.db";
const DATABASE_VERSION = 1; // La version actuelle attendue par le code (entier)
const DATABASE_DISPLAYNAME = "React Native Test Database";
const DATABASE_SIZE = 200000;

// Schéma initial (Version 0)
const v0Schema = `
    CREATE TABLE IF NOT EXISTS items(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20), quantity INTEGER);
    INSERT INTO items (name, quantity) VALUES ('Pomme', 10);
    INSERT INTO items (name, quantity) VALUES ('Banane', 15);
    INSERT INTO items (name, quantity) VALUES ('Orange', 8);
`;

const migrationScripts = {
    // Les scripts à exécuter pour passer d'une version N à N+1
    // La clé est la version À PARTIR DE LAQUELLE on migre
    0: `
        ALTER TABLE items ADD COLUMN description VARCHAR(100) DEFAULT '';
        UPDATE items SET description = 'Fruit frais et croquant' WHERE name = 'Pomme';
        UPDATE items SET description = 'Source d''énergie' WHERE name = 'Banane';
        UPDATE items SET description = 'Riche en vitamine C' WHERE name = 'Orange';
        `, // Ce script migre de la version 0 à la version 1
    1: `
        `, // Ce script migre de la version 1 à la version 2 en ne faisant rien à la base de données
};


let db = null;

export const initDatabase = async () => {
    return new Promise((resolve, reject) => {
        SQLite.openDatabase(
            { name: DATABASE_NAME, location: 'default' },
            async (openedDb) => {
                db = openedDb;
                console.log("Database opened successfully.");
                await performMigrations();
                resolve();
            },
            error => {
                console.error("Error opening database: ", error);
                reject(error);
            }
        );
    });
};

const performMigrations = async () => {
    if (!db) {
        console.error("Database not open for migration!");
        return;
    }

    try {
        await db.transaction(async (txn) => {
            // Créer la table de migrations si elle n'existe pas
            await txn.executeSql(
                "CREATE TABLE IF NOT EXISTS _migrations (version INTEGER PRIMARY KEY, applied_at DATETIME DEFAULT CURRENT_TIMESTAMP);"
            );

            let currentDbVersion = 0;
            try {
                const [_, results] = await txn.executeSql("SELECT version FROM _migrations ORDER BY version DESC LIMIT 1;", []);
                if (results.rows.length > 0) {
                    currentDbVersion = results.rows.item(0).version;
                }
            } catch (e) {
                // Cette erreur peut se produire si la table _migrations vient d'être créée mais n'a pas encore d'entrées
                console.warn("Could not read migration table (maybe new DB?), assuming version 0.", e);
                currentDbVersion = 0;
            }
            
            console.log(`Current database version: ${currentDbVersion}`);
            console.log(`Target database version: ${DATABASE_VERSION}`);


            // Si la base est neuve (version 0 n'a pas été appliquée), appliquer le schéma initial
            // Cette condition est cruciale pour le premier lancement de l'application
            if (currentDbVersion === 0) {
                console.log("Database is new or at version 0. Applying initial schema (v0)...");
                const statements = v0Schema.split(';').filter(s => s.trim().length > 0);
                for (const statement of statements) {
                    try {
                        await txn.executeSql(statement, []);
                    } catch (e) {
                        console.error(`Error executing initial schema statement: ${statement}`, e);
                        throw e; // Important pour annuler la transaction si la création échoue
                    }
                }
                // Enregistrer que la version 0 a été appliquée
                await txn.executeSql("INSERT INTO _migrations (version) VALUES (0);");
                currentDbVersion = 0; // Confirmer que la DB est maintenant à la version 0
                console.log("Initial schema (v0) applied successfully.");
            }

            // Appliquer les migrations incrémentales jusqu'à la version cible
            while (currentDbVersion < DATABASE_VERSION) {
                const nextVersionToApply = currentDbVersion + 1; // La version vers laquelle on migre
                const migrationScript = migrationScripts[currentDbVersion]; // Le script pour passer de currentDbVersion à nextVersionToApply

                if (migrationScript) {
                    console.log(`Migrating database from v${currentDbVersion} to v${nextVersionToApply}...`);
                    const statements = migrationScript.split(';').filter(s => s.trim().length > 0);
                    for (const statement of statements) {
                        try {
                            console.log("Executing migration statement:", statement);
                            await txn.executeSql(statement, []);
                        } catch (e) {
                            console.error(`Error executing migration SQL statement: ${statement}`, e);
                            throw e; // Rollback la transaction en cas d'erreur
                        }
                    }
                    // Mettre à jour la version dans la table de migrations
                    await txn.executeSql("INSERT INTO _migrations (version) VALUES (?);", [nextVersionToApply]);
                    currentDbVersion = nextVersionToApply; // Mettre à jour la version actuelle pour la prochaine itération
                    console.log(`Migrated to v${currentDbVersion} successfully.`);
                } else {
                    console.warn(`No migration script found to upgrade from version ${currentDbVersion} to ${nextVersionToApply}. Aborting further migrations.`);
                    Alert.alert("Avertissement de Migration", `Aucun script de migration trouvé pour passer de la version ${currentDbVersion} à la version ${nextVersionToApply}.`);
                    break; // Arrêter si un script est manquant
                }
            }
            console.log("Database migration check completed. Database is up to date.");

        });
    } catch (e) {
        console.error("Error during database migration transaction:", e);
        Alert.alert("Erreur Fatale de Base de Données", "L'application n'a pas pu migrer la base de données correctement. Veuillez réinstaller l'application.");
        // Pour un cours, une alerte suffit. En production, cela nécessiterait une gestion d'erreur plus robuste.
    }
};


// Expose the database instance directly for transactions in other services
export const getDb = () => db;

// Export des fonctions de base de données (maintenant via l'instance db)
export const addDataItem = (name, quantity, description = '') => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                "INSERT INTO items (name, quantity, description) VALUES (?,?,?)",
                [name, quantity, description],
                (txn, results) => {
                    if (results.rowsAffected > 0) {
                        console.log("Item added: ", name);
                        resolve(true);
                    } else {
                        console.log("Failed to add item.");
                        resolve(false);
                    }
                },
                error => {
                    console.error("Error adding item: ", error);
                    reject(error);
                }
            );
        });
    });
};

export const getItems = () => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                "SELECT * FROM items ORDER BY id DESC",
                [],
                (txn, results) => {
                    let items = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        items.push(results.rows.item(i));
                    }
                    resolve(items);
                },
                error => {
                    console.error("Error getting items: ", error);
                    reject(error);
                }
            );
        });
    });
};

export const deleteItem = (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                "DELETE FROM items WHERE id = ?",
                [id],
                (txn, results) => {
                    if (results.rowsAffected > 0) {
                        console.log("Item deleted: ", id);
                        resolve(true);
                    } else {
                        console.log("Failed to delete item.");
                        resolve(false);
                    }
                },
                error => {
                    console.error("Error deleting item: ", error);
                    reject(error);
                }
            );
        });
    });
};

export const clearAllItems = () => {
    return new Promise((resolve, reject) => {
        db.transaction(txn => {
            txn.executeSql(
                "DELETE FROM items",
                [],
                (txn, results) => {
                    if (results.rowsAffected > 0) {
                        console.log("All items deleted.");
                        resolve(true);
                    } else {
                        console.log("No items to delete.");
                        resolve(false);
                    }
                },
                error => {
                    console.error("Error clearing all items: ", error);
                    reject(error);
                }
            );
        });
    });
};

export const closeDatabase = () => {
    if (db) {
        console.log("Closing database.");
        db.close(
            () => console.log("Database closed successfully!"),
            error => console.error("Error closing database: ", error)
        );
    }
};