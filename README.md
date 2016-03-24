# Dewordify2

Dewordify is used to facilitate the development of online course materials by converting MS Word documents into HTML pages.


```
npm install -g dewordify
```

## Usage
In the command line, navigate to the location of the Word Document and run

```
cd path/to/file/location
dewordify file_name.docx
```


## Dependancies:
The following packages make this project possible.
* [MammothJS](https://www.npmjs.com/package/mammoth) - Performs the initial conversion from docx to html
* [Cheerio](https://www.npmjs.com/package/cheerio) - Implements a jQuery like syntax within Nodejs for simple traversal and transformation of html structures.
* [JSBeautify](https://www.npmjs.com/package/js-beautify) - Outputs human readable html.
