FROM kong:2.8

USER root

# Установка зависимостей
RUN apk update && \
    apk add --no-cache git unzip luarocks pcre-dev openssl-dev gcc make curl

# Скачиваем нужную версию lua-resty-openidc вручную
RUN curl -L -o /tmp/lua-resty-openidc-0.7.5.rockspec https://raw.githubusercontent.com/zmartzone/lua-resty-openidc/master/lua-resty-openidc-0.7.5.rockspec && \
    luarocks install /tmp/lua-resty-openidc-0.7.5.rockspec

# Клонируем kong-oidc плагин и устанавливаем вручную
RUN git clone https://github.com/nokia/kong-oidc /tmp/kong-oidc && \
    mkdir -p /usr/local/share/lua/5.1/kong/plugins/oidc && \
    cp /tmp/kong-oidc/kong/plugins/oidc/*.lua /usr/local/share/lua/5.1/kong/plugins/oidc/ && \
    rm -rf /tmp/kong-oidc

USER kong
