FROM node:lts

# Аргументы принимающие из docker-compose.yml
ARG user
ARG uid

RUN usermod -u 1004 node
RUN mkdir /home/$user
RUN mkdir /home/node/app
RUN useradd -G root -u $uid -d /home/$user $user
RUN chown -R $user:$user /home/$user
RUN chown -R $user:$user /home/node

# Установка рабочей директории
WORKDIR /home/node/app/
USER $user
