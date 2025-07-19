FROM kong:3.6

USER root

RUN apk add git unzip luarocks \
 && luarocks install kong-oidc \
 && luarocks install lua-resty-openidc

USER kong
