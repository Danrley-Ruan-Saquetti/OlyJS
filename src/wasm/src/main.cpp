#include <emscripten.h>

#include <iostream>

extern "C" {
EMSCRIPTEN_KEEPALIVE
int add(int a, int b) { return a + b; }

EMSCRIPTEN_KEEPALIVE
int fatorial(int value) {
  if (value <= 1) {
    return 1;
  }

  return value * fatorial(value - 1);
}
}
