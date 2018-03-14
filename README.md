The aim of this repo is to be able to send __binary chunks__ through several `XMLHttpRequest` and, from nodejs, receive these parts and build the initial file from binaries.

##### Although this is not working by some reason that I don't know, and thats the repo's purpose.  

## Repro:

- clone && cd topath
- npm start
- browse `localhost:3000`
- pick a file
- see folder contents
- u may see the file, but is not well formed
- GL

## walk-through

on FE im using `file.slice` to split the file into several parts, this looks pretty fair as browser is setting `Content-Length` well..

on Backend Im using `fs.createWriteStream` to write binary data but likely encoding isn't correct somehow.. 
