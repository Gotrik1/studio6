FROM kong:3.6

USER root

RUN apt-get update && apt-get install -y git unzip luarocks \
 && luarocks install kong-oidc \
 && luarocks install lua-resty-openidc \
 && apt-get clean

USER kong
