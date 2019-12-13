"use strict";

var fs = require("fs");
var path = require("path");
var chalk = require("chalk");

var previewImageTag = "_dewordify_";
module.exports = constructSideBySide;

function constructSideBySide($, markoutMap) {

    $(".side-by-side").each(function () {
        var isNextCurrentFigure = null;

        $(this).children().each(function () {
            var $prev = $(this).prev();
            var $next = $(this).next();
            var isNextImage = $next.is("figure.img");
            var isNextParagraph = $next.is("p");



            if ($(this).is(":header")) {
                isNextCurrentFigure = true;
            }
            if ($(this).is("p")) {
                var pText = $(this).text().trim();
                var regex = /^((alt|reference|title)\s*:\s*)(.*)/ig;
                var match = regex.exec(pText);
                try {
                    var attrType = match[2].toLowerCase();
                } catch (er) {
                    console.log(er);
                }

                var $currentFigure;

                if (isNextCurrentFigure) {
                    $currentFigure = $(this).nextAll("figure.img").first();
                } else {
                    $currentFigure = $(this).prevAll("figure.img").first();
                }

                switch (attrType) {
                    case "alt":
                        $currentFigure.children("img").attr("alt", match[3]);
                        $(this).remove();
                        break;
                    case "reference":
                        $(this).addClass("reference");
                        if ($currentFigure.children("figcaption").length) {
                            $currentFigure.children("figcaption").append($(this));
                        } else {
                            $currentFigure.append($("<figcaption>").append($(this)));
                        }

                        break;
                    case "title":
                        $currentFigure.children("img").attr("title", match[3]);
                        $(this).remove();
                        break;
                    default:
                        if ($currentFigure.children("figcaption").length) {
                            $currentFigure.children("figcaption").append($(this));
                        } else {
                            $currentFigure.append($("<figcaption>").append($(this)));
                        }
                }
            }

            if ($(this).is("figure.img")) {
                if (isNextImage || isNextParagraph) {
                    isNextCurrentFigure = false;
                }

            }

        });

    });
}