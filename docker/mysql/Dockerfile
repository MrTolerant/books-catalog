FROM mysql:5.7

COPY ./docker-entrypoint-initdb.d/ /docker-entrypoint-initdb.d/
RUN rm -f /etc/mysql/conf.d/mysqldump.cnf
COPY my.cnf /etc/mysql/conf.d/