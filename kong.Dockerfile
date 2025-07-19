FROM kong:2.8-alpine

USER root

RUN apk update && \
    apk add --no-cache \
      git unzip curl pcre-dev openssl-dev gcc make lua5.1 lua5.1-dev luarocks && \
    # Устанавливаем lua-resty-openidc напрямую
    apk add --no-cache lua-resty-openidc

# Клонируем и копируем плагины OIDC, если нужно вручную
RUN git clone https://github.com/nokia/kong-oidc /tmp/kong-oidc && \
    mkdir -p /usr/local/share/lua/5.1/kong/plugins/oidc && \
    cp /tmp/kong-oidc/kong/plugins/oidc/*.lua /usr/local/share/lua/5.1/kong/plugins/oidc/ && \
    rm -rf /tmp/kong-oidc

USER kong
