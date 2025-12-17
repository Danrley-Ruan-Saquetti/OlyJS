#include "engine.h"

#include <cstdio>

static int counter = 0;

extern "C"
{

  void init()
  {
    counter = 0;
    printf("Engine initialized\n");
  }

  int step(int input, float dt)
  {
    counter += input;
    return counter;
  }
}
