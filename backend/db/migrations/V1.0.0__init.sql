CREATE SCHEMA IF NOT EXISTS USERS;

CREATE SEQUENCE IF NOT EXISTS USERS."USER_SEQ"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 100;

CREATE TABLE IF NOT EXISTS USERS.USERS
(
    ID    numeric      not null
        constraint "USER_PK"
            primary key DEFAULT nextval('USERS."USER_SEQ"'),
    NAME  varchar(200) not null,
    EMAIL varchar(200) not null
);
INSERT INTO USERS.USERS (NAME, EMAIL)
VALUES ('John', 'John@test.com'),
       ('Jane', 'Jane@test.com'),
       ('Jack', 'Jack@test.com'),
       ('Jill', 'Jill@test.com'),
       ('Joe', 'Joe@test.com');

