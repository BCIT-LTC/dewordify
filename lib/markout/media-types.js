"use strict";

var path = require("path");

module.exports = function (media, src) {
	var ext = path.extname(src);
    var type = null;
    var regex = RegExp("^((http|https|ftp):)");
    if (regex.test(src)){
        ext = "link";
    }

	switch (ext) {
        case "link":
            return "link";
			break;
		case ".mp3":
			type = "mpeg";
			break;
		case ".ogg":
			type = "ogg";
			break;
		case ".wav":
			type = "wav";
			break;
		case ".mp4":
            type = "mp4";
			break;
		case ".webm":
			type = "webm";
			break;
        default:
			return false;
	}

	if (type) {
		return media + "/" + type;
	} else {
		return false;
	}

};
