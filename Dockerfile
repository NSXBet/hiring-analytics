FROM 492684252576.dkr.ecr.us-east-1.amazonaws.com/node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────

FROM 492684252576.dkr.ecr.us-east-1.amazonaws.com/joseluisq/static-web-server:2 AS server

# ─────────────────────────────────────────────────────────────────────────────

FROM scratch

COPY --from=server /static-web-server /server
COPY --from=build /app/dist /public

EXPOSE 8000

ENTRYPOINT ["/server"]
CMD [ \
  "--port", "8000", \
  "--root", "/public", \
  "--page-fallback", "/public/index.html", \
  "--compression", "true", \
  "--cache-control-headers", "true", \
  "--security-headers", "true", \
  "--health", "true", \
  "--log-level", "warn" \
]
