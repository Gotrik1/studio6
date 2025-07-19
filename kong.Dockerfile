# Dockerfile.kong
FROM kong:2.8

USER root

# Устанавливаем зависимости через apk (Alpine Linux)
RUN apk update && \
    apk add --no-cache git unzip luarocks pcre-dev openssl-dev gcc make && \
    luarocks install lua-resty-openidc

# Установка кастомного плагина kong-oidc
RUN git clone https://github.com/nokia/kong-oidc /tmp/kong-oidc && \
    mkdir -p /usr/local/share/lua/5.1/kong/plugins/oidc && \
    cp /tmp/kong-oidc/kong/plugins/oidc/*.lua /usr/local/share/lua/5.1/kong/plugins/oidc/ && \
    rm -rf /tmp/kong-oidc

USER kong
