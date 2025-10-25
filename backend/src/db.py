import sqlite3
from secrets import token_hex

class DB_Defaults:
    path = "db/users.db"


def drop_database():
    with sqlite3.connect(DB_Defaults.path) as conn:
        cursor = conn.cursor()

        cursor.execute("DROP TABLE IF EXISTS users")
        cursor.execute("DROP TABLE IF EXISTS tokens")
        cursor.execute("DROP TABLE IF EXISTS vertexes")

        conn.commit()


def create_database():
    with sqlite3.connect(DB_Defaults.path) as conn:
        cursor = conn.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                login TEXT NOT NULL,
                password TEXT NOT NULL
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                token TEXT NOT NULL
            )
        ''')

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS vertexes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                address TEXT NOT NULL,
                client_type TEXT,
                lt REAL,
                lg REAL
            )
        ''')

        conn.commit()


def token_already_exists(token):
    with sqlite3.connect(DB_Defaults.path) as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM tokens WHERE token == ?", (token,))

        user_id = cursor.fetchone()
        conn.commit()

    return user_id is not None


def login_already_exists(login):
    with sqlite3.connect(DB_Defaults.path) as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM users WHERE login == ?", (login,))

        user_id = cursor.fetchone()
        conn.commit()

    return user_id is not None


def add_user(login, password):
    if login_already_exists(login):
        return None

    with sqlite3.connect(DB_Defaults.path) as conn:
        cursor = conn.cursor()

        token: str = token_hex(16)
        while token_already_exists(token):
            token = token_hex(16)

        cursor.execute("INSERT INTO users (login, password) VALUES (?, ?)", (login, password))
        cursor.execute("INSERT INTO tokens (token) VALUES (?)", (token, ))

        conn.commit()

    return token


def get_user_id_from_login_and_pass(login, password):
    with sqlite3.connect(DB_Defaults.path) as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM users WHERE login == ? AND password == ?", (login, password))

        user_id = cursor.fetchone()

        if user_id is None:
            return None

        return user_id[0]


def get_user_token(login, password):
    user_id = get_user_id_from_login_and_pass(login, password)

    if user_id is None:
        return None

    with sqlite3.connect(DB_Defaults.path) as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT token FROM tokens WHERE id == ?", (user_id, ))
        token = cursor.fetchone()[0]

        conn.commit()

    return token


def get_user_id(token):
    with sqlite3.connect(DB_Defaults.path) as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM tokens WHERE token == ?", (token,))

        user_id = cursor.fetchone()

        if user_id is None:
            return None

        return user_id[0]


def add_user_vertex(user_id, address, client_type, lt, lg):
    with sqlite3.connect(DB_Defaults.path) as conn:
        cursor = conn.cursor()

        cursor.execute(f"INSERT INTO vertexes (user_id, address, client_type, lt, lg) VALUES (?, ?, ?, ?, ?)",
            (user_id, address, client_type, lt, lg)
        )

        conn.commit()


def get_user_vertexes(token):
    user_id = get_user_id(token)

    if user_id is None:
        return None

    with sqlite3.connect(DB_Defaults.path) as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM vertexes WHERE user_id == ?", (user_id,))

        vertexes = []

        for row in cursor.fetchall():
            vertexes.append({
                "address": row[2],
                "client_type": row[3],
                "lt": row[4],
                "lg": row[5]
            })

        return vertexes


if __name__ == "__main__":
    drop_database()
    create_database()

    # token = add_user("test", "test")

    print(get_user_token("test", "test"))
