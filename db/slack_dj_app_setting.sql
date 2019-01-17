create table app_setting
(
  id    int auto_increment
    primary key,
  type  varchar(255) not null,
  value varchar(255) not null
);

