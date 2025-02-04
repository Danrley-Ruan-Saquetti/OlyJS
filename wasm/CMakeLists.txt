cmake_minimum_required(VERSION 3.10)
project(wasm_app)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_COMPILER emcc)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/build_wasm)

add_executable(wasm_app src/main.cpp)

set_target_properties(wasm_app PROPERTIES OUTPUT_NAME "wasm_app")
set_target_properties(wasm_app PROPERTIES LINK_FLAGS "-s EXPORTED_FUNCTIONS='[_add]' -s MODULARIZE=1 -o build_wasm/wasm_app.js")
