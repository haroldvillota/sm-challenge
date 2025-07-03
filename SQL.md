# Entregable: Gestión de Chistes en SQL

## Configuración Inicial

### 1. Creación de Usuarios

```sql
-- Creación de usuarios
INSERT INTO users (username, created_at) VALUES
('Manolito', CURRENT_TIMESTAMP),
('Pepe', CURRENT_TIMESTAMP),
('Isabel', CURRENT_TIMESTAMP),
('Pedro', CURRENT_TIMESTAMP);
```

### 2. Creación de Temáticas

```sql
-- Creación de temáticas
INSERT INTO categories (name, description, created_at) VALUES
('Humor negro', 'Chistes de humor negro', CURRENT_TIMESTAMP),
('Humor amarillo', 'Chistes de humor amarillo', CURRENT_TIMESTAMP),
('Chistes verdes', 'Chistes verdes', CURRENT_TIMESTAMP);
```

### 3. Creación de Chistes

```sql
-- Chistes de Humor Negro
INSERT INTO jokes (content, user_id, category_id, created_at) VALUES
('¿Qué le dice un cementerio a otro? - "Negocio muerto"', 1, 1, CURRENT_TIMESTAMP),
('¿Por qué los esqueletos no pelean? - Porque no tienen agallas', 1, 1, CURRENT_TIMESTAMP),
('¿Qué le dice una urna a otra? - "Tienes una cara que no te cremaría nadie"', 1, 1, CURRENT_TIMESTAMP),
('¿Qué hace un mudo en un velorio? - "..."', 2, 1, CURRENT_TIMESTAMP),
('¿Cómo se llama el hermano vegetariano de Bruce Lee? - Broco Lee', 2, 1, CURRENT_TIMESTAMP),
('¿Qué le dice un gusano a otro? - "Vamos a dar una vuelta a la manzana"', 2, 1, CURRENT_TIMESTAMP),
('¿Qué hace un zombie en el gimnasio? - Muertos', 3, 1, CURRENT_TIMESTAMP),
('¿Qué le dice una tumba a otra? - "Qué hueso contigo"', 3, 1, CURRENT_TIMESTAMP),
('¿Cómo se suicida un vampiro? - Con una estaca en el corazón', 3, 1, CURRENT_TIMESTAMP),
('¿Qué hace un muerto en un bar? - Nada', 4, 1, CURRENT_TIMESTAMP),
('¿Qué le dice un muerto a otro? - "Estás que te caes"', 4, 1, CURRENT_TIMESTAMP),
('¿Cómo se llama el muerto que no para de hablar? - Muertodeboca', 4, 1, CURRENT_TIMESTAMP);

-- Chistes de Humor Amarillo
INSERT INTO jokes (content, user_id, category_id, created_at) VALUES
('¿Qué hace una abeja en el gimnasio? - Zumba', 1, 2, CURRENT_TIMESTAMP),
('¿Qué le dice un huevo a una sartén? - Me tienes frito', 1, 2, CURRENT_TIMESTAMP),
('¿Qué hace una aguja en un pajar? - Trabajando', 1, 2, CURRENT_TIMESTAMP),
('¿Qué le dice un semáforo a otro? - No me mires, me estoy cambiando', 2, 2, CURRENT_TIMESTAMP),
('¿Cómo se despiden los químicos? - Ácido un placer', 2, 2, CURRENT_TIMESTAMP),
('¿Qué le dice una iguana a su hermana gemela? - Somos iguanitas', 2, 2, CURRENT_TIMESTAMP),
('¿Qué hace una foca en el cine? - Mirando una películaa', 3, 2, CURRENT_TIMESTAMP),
('¿Qué le dice un árbol a otro? - ¿Qué hojas?', 3, 2, CURRENT_TIMESTAMP),
('¿Cómo se llama el campeón de buceo japonés? - Tokofondo', 3, 2, CURRENT_TIMESTAMP),
('¿Qué le dice un espagueti a otro? - El cuerpo me pide salsa', 4, 2, CURRENT_TIMESTAMP),
('¿Qué hace una vaca en el ascensor? - Va de piso en piso', 4, 2, CURRENT_TIMESTAMP),
('¿Qué le dice una lámpara a otra? - Mejor no hablemos, que nos cuelgan', 4, 2, CURRENT_TIMESTAMP);

-- Chistes Verdes
INSERT INTO jokes (content, user_id, category_id, created_at) VALUES
('¿Qué le dice un condón a otro? - "No seas pelotudo"', 1, 3, CURRENT_TIMESTAMP),
('¿Qué hace un perro en una bañera? - El can-to', 1, 3, CURRENT_TIMESTAMP),
('¿Qué le dice una uva verde a una uva morada? - "Respira, por favor"', 1, 3, CURRENT_TIMESTAMP),
('¿Qué hace un jardinero en el cine? - Mirando "El Padrino"', 2, 3, CURRENT_TIMESTAMP),
('¿Qué le dice una cama a otra? - "En esta casa hay mucho movimiento"', 2, 3, CURRENT_TIMESTAMP),
('¿Cómo se llama el perro de un fontanero? - "Grifer"', 2, 3, CURRENT_TIMESTAMP),
('¿Qué hace un tomate en la cama? - Salsa', 3, 3, CURRENT_TIMESTAMP),
('¿Qué le dice un huevo a una gallina? - "Eres una cascarrabias"', 3, 3, CURRENT_TIMESTAMP),
('¿Cómo se llama el primo de un vampiro? - Chupatintas', 3, 3, CURRENT_TIMESTAMP),
('¿Qué hace un libro de Kamasutra en la biblioteca? - Está en la sección de "Obras que mueven"', 4, 3, CURRENT_TIMESTAMP),
('¿Qué le dice un preservativo usado a otro? - "Tú sí que sabes rodar"', 4, 3, CURRENT_TIMESTAMP),
('¿Cómo se llama el pez infiel? - Salmón trotamundos', 4, 3, CURRENT_TIMESTAMP);
```

## Consultas Solicitadas

### Consulta 1: Chistes creados por "Manolito"

```sql
SELECT j.content, c.name AS category
FROM jokes j
JOIN users u ON j.user_id = u.id
JOIN categories c ON j.category_id = c.id
WHERE u.username = 'Manolito';
```

**Resultado esperado:**
```
content                                           | category
--------------------------------------------------|------------
¿Qué le dice un cementerio a otro? - "Negocio muerto" | Humor negro
¿Por qué los esqueletos no pelean? - Porque no tienen agallas | Humor negro
¿Qué le dice una urna a otra? - "Tienes una cara que no te cremaría nadie" | Humor negro
¿Qué hace una abeja en el gimnasio? - Zumba | Humor amarillo
¿Qué le dice un huevo a una sartén? - Me tienes frito | Humor amarillo
¿Qué hace una aguja en un pajar? - Trabajando | Humor amarillo
¿Qué le dice un condón a otro? - "No seas pelotudo" | Chistes verdes
¿Qué hace un perro en una bañera? - El can-to | Chistes verdes
¿Qué le dice una uva verde a una uva morada? - "Respira, por favor" | Chistes verdes
```

### Consulta 2: Todos los chistes de "Humor negro"

```sql
SELECT j.content, u.username AS author
FROM jokes j
JOIN categories c ON j.category_id = c.id
JOIN users u ON j.user_id = u.id
WHERE c.name = 'Humor negro';
```

**Resultado esperado:**
```
content                                           | author
--------------------------------------------------|--------
¿Qué le dice un cementerio a otro? - "Negocio muerto" | Manolito
¿Por qué los esqueletos no pelean? - Porque no tienen agallas | Manolito
¿Qué le dice una urna a otra? - "Tienes una cara que no te cremaría nadie" | Manolito
¿Qué hace un mudo en un velorio? - "..." | Pepe
¿Cómo se llama el hermano vegetariano de Bruce Lee? - Broco Lee | Pepe
¿Qué le dice un gusano a otro? - "Vamos a dar una vuelta a la manzana" | Pepe
¿Qué hace un zombie en el gimnasio? - Muertos | Isabel
¿Qué le dice una tumba a otra? - "Qué hueso contigo" | Isabel
¿Cómo se suicida un vampiro? - Con una estaca en el corazón | Isabel
¿Qué hace un muerto en un bar? - Nada | Pedro
¿Qué le dice un muerto a otro? - "Estás que te caes" | Pedro
¿Cómo se llama el muerto que no para de hablar? - Muertodeboca | Pedro
```

### Consulta 3: Chistes de "Humor negro" creados por "Manolito"

```sql
SELECT j.content
FROM jokes j
JOIN users u ON j.user_id = u.id
JOIN categories c ON j.category_id = c.id
WHERE u.username = 'Manolito' AND c.name = 'Humor negro';
```

**Resultado esperado:**
```
content
--------------------------------------------------
¿Qué le dice un cementerio a otro? - "Negocio muerto"
¿Por qué los esqueletos no pelean? - Porque no tienen agallas
¿Qué le dice una urna a otra? - "Tienes una cara que no te cremaría nadie"
```

## Diagrama de Base de Datos (Esquema)

```
+-------------+       +-------------+       +---------------+
|    users    |       |   jokes     |       |  categories   |
+-------------+       +-------------+       +---------------+
| id          |<----->| id          |<----->| id            |
| username    |       | content     |       | name          |
| created_at  |       | user_id     |       | description   |
+-------------+       | category_id |       | created_at    |
                      | created_at  |       +---------------+
                      +-------------+
```
