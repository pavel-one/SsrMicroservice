FROM node:lts

# Аргументы принимающие из docker-compose.yml
ARG user
ARG uid

# Для виртуального хрома
RUN apt update
RUN apt install -y libnss3-tools
RUN apt install -y libatk-bridge*

RUN apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN usermod -u 1004 node
RUN mkdir /home/$user
RUN mkdir /home/node/app
RUN useradd -G root -u $uid -d /home/$user $user
RUN chown -R $user:$user /home/$user
RUN chown -R $user:$user /home/node

# Установка рабочей директории
WORKDIR /home/node/app/
USER $user
