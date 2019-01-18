create table bot_response
(
  id      int auto_increment
    primary key,
  message varchar(255) not null,
  type    varchar(255) not null
);

