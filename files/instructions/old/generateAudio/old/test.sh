#!/bin/zsh
rm output.txt
zmodload zsh/datetime
say --interactive  --rate=180 -v 'Alex' -f test.txt | {
    counter=0
    while IFS= read -r -d $'\r' line; do
        (( counter++ )) || continue  # first line in the output of `say --interactive` suppresses the cursor; discard this line
        timestamp=$EPOCHREALTIME
        (( counter == 2 )) && offset=$timestamp  # set the timestamp of the actual first line at the offset
        (( timestamp -= offset ))
    printf "%05.4f " $timestamp >> output.txt
    /usr/bin/sed -E $'s/.*\x1b\\[7m(.*)\x1b\\[m.*/\\1/' <<<"$line" >> output.txt
    done
}
