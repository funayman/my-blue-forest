#!/bin/sh
docker run -it --rm -v $(pwd):/opt/app dd16abc/webtools:alpine $@
