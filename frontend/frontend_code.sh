#!/bin/bash

# Define the output file
output_file="frontend.txt"

# Check if the src directory exists
if [ -d "src" ]; then
  # Clear the output file if it exists, or create a new one
  > "$output_file"
  
  # First, write the directory structure (excluding files) to the output file
  find src/ -type d -print >> "$output_file"

  # Then, for each file, append the filename followed by the content of the file
  find src/ -type f ! -name "*.css" ! -name "*.ico" | while read -r file; do
    echo "===== $file =====" >> "$output_file"
    cat "$file" >> "$output_file"
    echo -e "\n\n" >> "$output_file"  # Add some spacing between files
  done

  echo "Directory structure and file contents (excluding .css and .ico) written to $output_file"
else
  echo "The 'src' directory does not exist."
fi
