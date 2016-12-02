# Dewordify2

Dewordify is used to facilitate the development of online course materials by converting MS Word documents into HTML pages.

1. Install node [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
2. Install dewordify

```
(sudo) npm install -g
```

## Usage
In the command line, navigate to the location of the Word Document (docx) and run

```
cd path/to/file/location
dewordify
```
If the word file that you would like to parse is not the most recently modified docx file in the folder, either re-save it so that it is, or tell dewordify which file to target like so:

```
dewordify file_name.docx
```


## Dependancies:
The following packages make this project possible.
* [MammothJS](https://www.npmjs.com/package/mammoth) - Performs the initial conversion from docx to html
* [Cheerio](https://www.npmjs.com/package/cheerio) - Implements a jQuery like syntax within Nodejs for simple traversal and transformation of html structures.
* [JSBeautify](https://www.npmjs.com/package/js-beautify) - Outputs human readable html.
