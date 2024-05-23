BEGIN;

CREATE TABLE IF NOT EXISTS dangerous_goods
(
    id
    SERIAL
    PRIMARY
    KEY,
    uuid
    UUID
    DEFAULT
    uuid_generate_v4
(
) UNIQUE,
    un_class VARCHAR
(
    10
) NOT NULL,
    dangerous_goods VARCHAR
(
    255
) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                             );

CREATE INDEX idx_dangerous_goods_uuid ON dangerous_goods (uuid);
CREATE INDEX idx_dangerous_goods_un_class ON dangerous_goods (un_class);

CREATE TABLE IF NOT EXISTS dangerous_goods_classifications
(
    id
    SERIAL
    PRIMARY
    KEY,
    uuid
    UUID
    DEFAULT
    uuid_generate_v4
(
) UNIQUE,
    dangerous_goods_id INTEGER REFERENCES dangerous_goods
(
    id
) ON DELETE CASCADE,
    division VARCHAR
(
    10
) NOT NULL,
    classification VARCHAR
(
    255
) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
  WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

CREATE INDEX idx_dangerous_goods_classifications_uuid ON dangerous_goods_classifications (uuid);
CREATE INDEX idx_dangerous_goods_classifications_division ON dangerous_goods_classifications (division);

INSERT INTO dangerous_goods (un_class, dangerous_goods)
VALUES ('1', 'Explosives'),
       ('2', 'Gases'),
       ('3', 'Flammable liquid'),
       ('4', 'Flammable solids'),
       ('5', 'Oxidising substances'),
       ('6', 'Toxic substances'),
       ('7', 'Radioactive material'),
       ('8', 'Corrosive substances'),
       ('9', 'Miscellaneous dangerous goods');

INSERT INTO dangerous_goods_classifications (uuid, dangerous_goods_id, division, classification)
VALUES (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '1'), '1.1', 'Explosive'),
       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '1'), '1.2', 'Explosive'),
       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '1'), '1.3', 'Explosive'),
       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '1'), '1.4', 'Explosive'),
       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '1'), '1.5', 'Explosive'),
       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '1'), '1.6', 'Explosive'),

       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '2'), '2.1', 'Flammable gas'),
       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '2'), '2.2',
        'Non-flammable, non-toxic gas'),
       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '2'), '2.3', 'Toxic gas'),

       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '3'), '3', 'Flammable liquid'),

       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '4'), '4.1', 'Flammable solid'),
       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '4'), '4.2',
        'Spontaneously combustible substance'),
       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '4'), '4.3',
        'Substance which in contact with water emits flammable gas'),

       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '5'), '5.1', 'Oxidising substance'),
       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '5'), '5.2', 'Organic peroxide'),

       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '6'), '6.1', 'Toxic substance'),
       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '6'), '6.2', 'Infectious substance'),

       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '7'), '7', 'Radioactive material'),

       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '8'), '8', 'Corrosive substance'),

       (uuid_generate_v4(), (SELECT id FROM dangerous_goods WHERE un_class = '9'), '9',
        'Miscellaneous dangerous goods');

COMMIT;