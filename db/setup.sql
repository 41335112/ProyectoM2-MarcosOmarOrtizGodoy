CREATE TABLE authors (
 id SERIAL PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 email VARCHAR(150) UNIQUE NOT NULL,
 bio TEXT,
 created_at TIMESTAMPTZ DEFAULT NOW()
);

    INSERT INTO authors (name, email, bio) VALUES
    ('Carlos lopez', 'carloslopez@example.com', 'Escritor técnico especializado '),
    ('María Carmen', 'mariacarmen@example.com', 'software con foco en APIs REST');