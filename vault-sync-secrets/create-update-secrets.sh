#!/bin/bash

# Check if the environment variable is set
if [ -z "$DIRECTORIES" ]; then
    echo "DIRECTORIES environment variable is not set."
    exit 1
fi

# Split the DIRECTORIES variable into an array
IFS=':' read -r -a dir_array <<< "$DIRECTORIES"

# Loop through each directory and source the files
for dir in "${dir_array[@]}"; do
    if [ -d "$dir" ]; then
        for file in "$dir"/*; do
            if [ -f "$file" ]; then
                echo "Sourcing file: $file"
                source "$file"
                cat "$file"
            fi
        done
    else
        echo "Directory $dir does not exist."
    fi
done
