#!/bin/bash

# Define the output file
output_file="backend.txt"

# Check if the src directory exists
if [ -d "src" ]; then
  # Clear the output file if it exists, or create a new one
  > "$output_file"
  
  # If server.js exists, include its content at the start
  if [ -f "server.js" ]; then
    echo "===== server.js =====" >> "$output_file"
    cat "server.js" >> "$output_file"
    echo -e "\n\n" >> "$output_file"  # Add some spacing after the file
    echo "server.js content written to $output_file"
  else
    echo "server.js does not exist."
  fi

  # Then, write the directory structure (including files) to the output file
  find src/ -type d -print >> "$output_file"

  # Then, for each file in the src directory, append the filename followed by the content of the file
  find src/ -type f | while read -r file; do
    echo "===== $file =====" >> "$output_file"
    cat "$file" >> "$output_file"
    echo -e "\n\n" >> "$output_file"  # Add some spacing between files
  done

  echo "Directory structure and file contents (from src) written to $output_file"
else
  echo "The 'src' directory does not exist."
fi

echo "Complete directory structure and file contents written to $output_file"
