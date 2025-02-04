FROM emscripten/emsdk:latest AS builder

WORKDIR /app

COPY CMakeLists.txt .
COPY src/ src/

CMD mkdir -p build_wasm && cd build_wasm && emcmake cmake .. && cmake --build .