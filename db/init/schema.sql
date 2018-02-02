ALTER DATABASE blueforest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

/*
USE `blueforest`;

DROP TABLE IF EXISTS post_type;
CREATE TABLE post_type (
  type VARCHAR(2) UNIQUE ,
  value VARCHAR(255) UNIQUE ,
  PRIMARY KEY (type)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS tag;
CREATE TABLE tag (
  tid INTEGER AUTO_INCREMENT,
  name VARCHAR(255) UNIQUE ,
  PRIMARY KEY (tid)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS user;
CREATE TABLE user (
  username VARCHAR(255) UNIQUE ,
  password VARCHAR(255),
  email VARCHAR(255) UNIQUE ,
  PRIMARY KEY (email)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS post_tag;
CREATE TABLE post_tag (
  pid INTEGER,
  tid INTEGER
) ENGINE=InnoDB;

DROP TABLE IF EXISTS post;
CREATE TABLE post (
  pid INTEGER AUTO_INCREMENT,
  title VARCHAR(255),
  description VARCHAR(255),
  dateCreated BIGINT,
  dateModified BIGINT,
  asset VARCHAR(255) DEFAULT '/assets/shared/default.png',
  type VARCHAR(255) NOT NULL,
  dtype varchar(31) NOT NULL,
  user VARCHAR(255),
  PRIMARY KEY (pid)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS comment;
CREATE TABLE comment (
  cid INTEGER AUTO_INCREMENT,
  data VARCHAR(255),
  pid INTEGER,
  user VARCHAR(255),
  dateCreated DATE,
  answer BOOL,
  PRIMARY KEY (cid)
) ENGINE=InnoDB;

ALTER TABLE post_tag ADD FOREIGN KEY pid_idxfk (pid) REFERENCES post (pid);

ALTER TABLE post_tag ADD FOREIGN KEY tid_idxfk (tid) REFERENCES tag (tid);

ALTER TABLE post ADD FOREIGN KEY type_idxfk (type) REFERENCES post_type (type);

ALTER TABLE post ADD FOREIGN KEY user_idxfk (user) REFERENCES user (email);

ALTER TABLE comment ADD FOREIGN KEY pid_idxfk_1 (pid) REFERENCES post (pid);

ALTER TABLE comment ADD FOREIGN KEY user_idxfk_1 (user) REFERENCES user (email);
*/
