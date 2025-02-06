cmake_minimum_required(VERSION 3.10)
project(engine)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_COMPILER emcc)

set(BIN_OUTPUT_DIR ${CMAKE_SOURCE_DIR}/build_wasm)
file(MAKE_DIRECTORY ${BIN_OUTPUT_DIR})

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${BIN_OUTPUT_DIR})
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${BIN_OUTPUT_DIR})

add_executable(engine src/main.cpp)

set_target_properties(engine PROPERTIES OUTPUT_NAME "engine")
set_target_properties(engine PROPERTIES
  RUNTIME_OUTPUT_DIRECTORY ${BIN_OUTPUT_DIR} 
  LIBRARY_OUTPUT_DIRECTORY ${BIN_OUTPUT_DIR}
  LINK_FLAGS "-s EXPORTED_FUNCTIONS='[_add, _fatorial]' -s MODULARIZE=1 -o ${BIN_OUTPUT_DIR}/engine.js"
)
