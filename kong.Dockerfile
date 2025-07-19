FROM kong:3.6

USER root

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    luarocks \
    gcc \
    libpcre3-dev \
    libssl-dev \
    make \
 && git clone https://github.com/zmartzone/lua-resty-openidc /opt/lua-resty-openidc \
 && cp -r /opt/lua-resty-openidc/lib/resty /usr/local/share/lua/5.1/ \
 && git clone https://github.com/nokia/kong-oidc /usr/local/share/lua/5.1/kong/plugins/oidc \
 && apt-get clean

USER kong
