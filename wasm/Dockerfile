FROM emscripten/emsdk:latest AS builder

WORKDIR /app

COPY CMakeLists.txt .
COPY src/ src/

RUN emcmake cmake . && cmake --build .

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/wasm_app.js .
COPY --from=builder /app/wasm_app.wasm .
COPY src/index.html .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]