FROM kong:2.8

USER root

# Устанавливаем зависимости через apt (для Debian-based образа)
RUN apt-get update && \
    apt-get install -y git unzip luarocks libpcre3-dev libssl-dev gcc make && \
    luarocks install lua-resty-openidc

RUN git clone https://github.com/nokia/kong-oidc /tmp/kong-oidc && \
    mkdir -p /usr/local/share/lua/5.1/kong/plugins/oidc && \
    cp /tmp/kong-oidc/kong/plugins/oidc/*.lua /usr/local/share/lua/5.1/kong/plugins/oidc/ && \
    rm -rf /tmp/kong-oidc

USER kong
