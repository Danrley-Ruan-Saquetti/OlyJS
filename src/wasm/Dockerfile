FROM emscripten/emsdk:latest AS builder

WORKDIR /app

COPY CMakeLists.txt .
COPY src/ src/

CMD mkdir -p lib_wasm && cd lib_wasm && emcmake cmake .. && cmake --build .
