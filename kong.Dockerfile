FROM kong:2.8

USER root

# Заменили apt-get → apk (Alpine Linux)
RUN apk update && \
    apk add --no-cache git unzip luarocks libpcre-dev openssl-dev gcc make && \
    luarocks install lua-resty-openidc

# Клонируем плагин и копируем его правильно
RUN git clone https://github.com/nokia/kong-oidc /tmp/kong-oidc && \
    mkdir -p /usr/local/share/lua/5.1/kong/plugins/oidc && \
    cp /tmp/kong-oidc/kong/plugins/oidc/*.lua /usr/local/share/lua/5.1/kong/plugins/oidc/ && \
    rm -rf /tmp/kong-oidc

USER kong
