from codecs import latin_1_decode
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
                lat REAL,
                lon REAL
            )
        ''')

        conn.commit()


def add_user(login, password):
    with sqlite3.connect(DB_Defaults.path) as conn:
        cursor = conn.cursor()

        token: str = token_hex(16)

        cursor.execute("INSERT INTO users (login, password) VALUES (?, ?)", (login, password))
        cursor.execute("INSERT INTO tokens (token) VALUES (?)", (token, ))

        conn.commit()

    return token


def get_user_id(token):
    with sqlite3.connect(DB_Defaults.path) as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM tokens WHERE token == ?", (token,))
        return cursor.fetchone()[0]


def add_user_vertex(token, address, lat, lon):
    user_id = get_user_id(token)

    with sqlite3.connect(DB_Defaults.path) as conn:
        cursor = conn.cursor()

        cursor.execute(f"INSERT INTO vertexes (user_id, address, lat, lon) VALUES (?, ?, ?, ?)",
            (user_id, address, lat, lon)
        )

        conn.commit()


def add_several_user_vertexes(token, vertexes):
    for vertex in vertexes:
        add_user_vertex(token, vertex)


def get_user_vertexes(token):
    user_id = get_user_id(token)

    with sqlite3.connect(DB_Defaults.path) as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM vertexes WHERE user_id == ?", (user_id,))

        data = {}

        for row in cursor.fetchall():
            if row[1] not in data.keys():
                data[row[1]] = []

            data[row[1]].append({
                "address": row[2],
            })

        return data


if __name__ == "__main__":
    drop_database()
    create_database()

    add_user("test", "test")

    add_user_vertex("test+test", "petersburg")
    add_user_vertex("test+test", "moscow")

    print(get_user_vertexes("test+test"))
