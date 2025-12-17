cmake_minimum_required(VERSION 3.20)
project(EngineWASM VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_EXECUTABLE_SUFFIX ".js")
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)

set(APP_NAME "engine")

file(GLOB_RECURSE SOURCES
  CONFIGURE_DEPENDS
  src/*.cpp
)

add_executable(${APP_NAME} ${SOURCES})

target_link_options(${APP_NAME}
  PRIVATE
  -sWASM=1
  -sMODULARIZE=1
  -sEXPORT_ES6=1
  -sENVIRONMENT=web
  -sEXPORTED_FUNCTIONS=_init,_step
  -sEXPORTED_RUNTIME_METHODS=ccall,cwrap
  -sALLOW_MEMORY_GROWTH=1
)

target_include_directories(${APP_NAME}
  PRIVATE
    include
)
