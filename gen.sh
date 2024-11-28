#!/bin/bash

gen_files() {
  touch "part$1.ts"
  echo "import fs from 'fs';" >> part$1.ts
  echo $'const filename = \'testinput.txt\';\n' >> part$1.ts
  echo "const rawInput = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r'});" >> part$1.ts
  echo "const input = rawInput.split('\n');" >> part$1.ts
}

gen_year() {
  mkdir $1
  cd $1

  for i in {1..25}
  do
    mkdir "day$i"
    cd "day$i"
    touch "testinput.txt"
    touch "input.txt"
    gen_files 1
    gen_files 2
    cd ..
  done
}

if [ -z "$1" ]
then
    echo "No year supplied"
else
  gen_year $1
fi
