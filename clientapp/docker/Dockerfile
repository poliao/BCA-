FROM docker.io/caddy:2.7-alpine AS base

LABEL org.opencontainers.image.title="WebPortal Client"
LABEL org.opencontainers.image.authors="Attaporn_J<attaporn_j@softsquaregroup.com>"
LABEL org.opencontainers.image.source="https://github.com/softsquare-pueantae-github/pico-web-portal"

FROM docker.io/node:20-bullseye-slim AS build

WORKDIR /web
COPY . ./

ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV NPM_CONFIG_AUDIT=false
ENV NPM_CONFIG_PROGRESS=false
ENV NPM_CONFIG_LOG_LEVEL=error
ENV NPM_CONFIG_LEGACY_PEER_DEPS=true

RUN npm ci --loglevel=error && \
    npm run build

# Build runtime image
FROM base AS runtime

COPY docker/Caddyfile /etc/caddy/Caddyfile

WORKDIR /usr/share/caddy

COPY --from=build /web/dist/ssclean/browser/ /usr/share/caddy/
# COPY dist/ssclean/ /usr/share/caddy/
