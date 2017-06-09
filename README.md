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
## Customization

### HTML Templates
By default, Dewordify uses an HTML template designed for use in the production of courses at BCIT.  This is not ideal for anybody but BCIT.

If you would like to use your own custom template, simply include a file called `template.html` in the same folder as the word document you would like to convert.

In order to save you time, Dewordify will also search up to 3 folders above your working directory.  It will use the first `template.html` file that it finds starting in the working directory.  That means that you can have a general template defined higher up in your course production folders while providing more specific templates closer to the word documents they will apply to.

#### Example:
Take a look at the following structure:
```
└───modules
    ├───00
    │   ├───00.docx
    │   └───template.html	 
    ├───01
    │   └───01.docx
    ├───02
    │   └───02.docx
    └───template.html
```
In this example both 01.docx and 02.docx will use the common template found in the modules folder, while 00.docx has a custom template.

#### Content Placement
When you create your `template.html`, you might ask "where will my content go".  This question actually has multiple answers.  In priority order:
1. Wherever you place a `<content/>` or `<content></content>` tag (the tag itself will be removed).
2. Inside a tag with `class="container` (Depracated!)
3. Prepended to the `<body>` tag (allowing for footer text and low priority `<script>` tags)

If none of these conditions are met, only the contents will be returned.

### Markout:
"Markout" is the name we've given to our unique syntax for indicating blocks of content that require custom styling.  Markout consists of 3 items used in combination to form "markers":

1. A starting symbol (default `#`)
2. An ending symbol (default `/`)
3. A specific word which is mapped to a wrapping tag (typically an instructional term with an appropriately named wrapper)

A starting marker would be a combination of 1 and 3 (eg `#marker`) while an ending marker would be 2 and 3 (eg `/marker`).  You would then use the starting and ending markers to indicate content blocks in your word document like so: 

```
#marker
Some block of text.
Possibly spanning multiple lines.
/marker
```

#### Custom Markers:
While Dewordify includes a default set of markers developed in-house at BCIT (documented in [BCIT's Conversion Guide](https://ltc.bcit.ca/courseproduction/conversionguide/)), there may come a time where you want to modify, expand, or define an entirely new set of custom markers.  To do this, you will need to supply Dewordify with a `markoutMap.json` file.  

**Don't Panic!**

Simply look in the `default-files` folder for a file with the same name and copy it into your working folder.  It's pretty straight forward to edit.  For starters, you can edit the start and end symbols if `#` and `/` somehow conflict with your internal processes.  Second, you will see a set of `wrappers` which represent #3 mentioned above.  Lastly, there are a set of mappings which simply map mispelled or dirivative words to the appropriate wrappers.

Like templates, you can place these up to 3 folders above your working directory.

### MS Word Styles
From time to time, you will see the following: `[MAMMOTH WARNING] Unknown Word Styles`.

**Don't Panic!**

This isn't actually a mammoth warning in the sense that it's enormous.  In fact, it's usually quite trivial.  It's "mammoth" because it was identified Mammoth.js, the javascript library which is responsible for the initial docx to HTML conversion.  "Unknown Word Styles" are any styles in MS Word (think "Heading 1") that haven't been mapped to a corresponding HTML tag.

The first step when you encounter this should be to look at the word document and try to identify the culprit.  Usually it's insignificant and can be ignored or manually corrected in either the word document or HTML.  In cases where it has wide ranging impacts on the output, read-on.

#### Style Mapping (Advanced)
Similar to the way you include custom templates and markoutMaps, you can supply a custom `styleMap.txt` file.  Unlike the others, the `styleMap.txt` file that you supply will be appended to the default styleMap found in the `default-files` folder.

First, style mappings are a little difficult to describe and are actually a feature of Mammoth.js so I'll start by referring you to the [custom style map documentation in Mammoth.js](https://github.com/mwilliamson/mammoth.js#custom-style-map).

Second, I've gone to the trouble of creating a `styleMap-reference-list.txt` (also found in the `default-files` folder) which shows a comprehensive listing of every unmapped style that I could find in the guts of MS Word.  This gives you a start at figuring out the most confusing part which is whether the style is a "run" or "paragraph" type (think inline vs block level HTML).  You can simply copy that line into your custom `styleMap.txt` file and modify the output to whatever you desire.  

Note: It's possible for people to define their own custom styles in which cases you won't find them listed in the reference list.

Another confusing part of style mapping is the `:fresh` declaration.  Without it, adjacent styles of the same type will be combined into a single tag.  I found experimentation to be the best way to understand.  For example, what would you expect the output of this to be: `div.parent > p.child:fresh`

It's worth noting again that styleMaps are appended to the one found in the `default-files` folder so your custom `styleMap.txt` file should only contain the styles that you are fixing.

## Dependancies:
The following packages make this project possible.
* [MammothJS](https://www.npmjs.com/package/mammoth) - Performs the initial conversion from docx to html
* [Cheerio](https://www.npmjs.com/package/cheerio) - Implements a jQuery like syntax within Nodejs for simple traversal and transformation of html structures.
* [JSBeautify](https://www.npmjs.com/package/js-beautify) - Outputs human readable html.
