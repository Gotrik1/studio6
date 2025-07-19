# Используем образ Kong
FROM kong:2.8

USER root

# Устанавливаем зависимости
RUN apt-get update && \
    apt-get install -y git luarocks libpcre3-dev libssl-dev gcc make unzip && \
    luarocks install lua-resty-openidc

# Клонируем плагин и копируем его правильно
RUN git clone https://github.com/nokia/kong-oidc /tmp/kong-oidc && \
    mkdir -p /usr/local/share/lua/5.1/kong/plugins/oidc && \
    cp /tmp/kong-oidc/kong/plugins/oidc/*.lua /usr/local/share/lua/5.1/kong/plugins/oidc/ && \
    rm -rf /tmp/kong-oidc

# Убедись, что запускаемся не под root
USER kong
