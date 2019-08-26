#!/bin/sh
tsc --version
tsc --rootDir source/ --outDir distrib/  source/*.ts source/host/*.ts source/os/*.ts
