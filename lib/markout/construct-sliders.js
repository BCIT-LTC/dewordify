"use strict";

var fs = require("fs");
var path = require("path");
var chalk = require("chalk");

var previewImageTag = "_dewordify_";
module.exports = constructSliders;

function constructSliders($, markoutMap) {

    $(".slider").each(function () {
        var start = [];
        var end = [];
        var i = 0;
        $(this).children().each(function () {
            var isHeader = $(this).is("h2");
            var isImage = $(this).is("img");
            var isPrevHeader = $(this).prev().is("h2");
            var isPrevImage = $(this).prev().is("img");
            var isNextHeader = $(this).next().is("h2");
            var isNextImage = $(this).next().is("img");
            var isNextSlide = isNextHeader || isNextImage;

            if (isHeader) {
                if (isNextImage) {
                    //console.log("\x1b[34m", "Header with image next");
                    start.push(i);
                } else {
                    //console.log("\x1b[34m", "Header with no image. >>> inserting <img>");
                    $(this).after($("<img>"));
                    start.push(i++);
                }
            } else if (isImage) {
                if (isPrevHeader) {
                    if (isNextSlide) {
                        //console.log("\x1b[34m", "Image with previous header and next image");
                        end.push(i + 1);
                    }
                } else {
                    if (isPrevImage) {
                        if (isNextSlide) {
                            //console.log("\x1b[34m", "IMAGE ONLY");
                            start.push(i);
                            end.push(i + 1);
                        }
                    } else {
                        //console.log("\x1b[34m", "Image with no header and previous NOT image");
                        start.push(i);
                    }
                }
            } else {
                if (isNextSlide) {
                    //console.log("\x1b[34m", "NOT image, NOT header, and next image/header");
                    end.push(i + 1);
                } else {
                    //console.log("EXTRA STUFF ON FIGCAPTION");
                }
            }
            i++;
        });
        end.push(i);

        // Reverse loop because slice() return the original object
        for (var index = start.length - 1; index >= 0; index--) {
            $(this).children().slice(start[index], end[index]).wrapAll($("<figure>").addClass("img"));
        }
        $(this).children("figure").addClass("img");
    });
}