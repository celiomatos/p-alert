# p-alert

puppeteer project


### Dockerfile ####

FROM node:10.16.0-alpine
WORKDIR /app
COPY . .
ENV CHROME_BIN="/usr/bin/chromium-browser"\
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
RUN set -x \
  && apk update \
  && apk upgrade \
  # replacing default repositories with edge ones
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" > /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
  \
  # Add the packages
  && apk add --no-cache dumb-init curl make gcc g++ python linux-headers binutils-gold gnupg libstdc++ nss chromium \
  \
  && npm install \
  \
  # Do some cleanup
  && apk del --no-cache make gcc g++ python binutils-gold gnupg libstdc++ \
  && rm -rf /usr/include \
  && rm -rf /var/cache/apk/* /root/.node-gyp /usr/share/man /tmp/* \
  && echo
ENTRYPOINT ["/usr/bin/dumb-init"]
CMD crond -l 2 -f

##### Comandos Uteis #####
docker exec -it ID /bin/sh
crontab -e
0 5 * * * cd cd /app && node index.js
[ESC]
:wq

docker build -f Dockerfile -t mycron .
docker run -d mycron
docker exec -it ID /bin/sh
docker cp nome-do-container:/opt/jboss C:\postgresql-9.1-901-1.jdbc4.jar



######################
docker volume create my-vol

docker run -d -p 9000:9000 --name my_minio 
-e "MINIO_ACCESS_KEY=C3AM3UQ867SPQQA43P2F" -e "MINIO_SECRET_KEY=zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG" 
-v my-vol:/data -v my-vol:/root/.minio -m 50M minio/minio server /data

docker exec -it ID /bin/sh
mv /data/certs /data/palert

docker build -f Dockerfile -t mycron .

docker run -v my-vol:/app/capturas -d mycron

docker exec -it ID /bin/sh
crontab -e
5	*	*	*	*	cd cd /app && node index.js
5	16	*	*	*	cd cd /app && node index.js