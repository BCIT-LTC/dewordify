module.exports = IDGenerator;

function IDGenerator($) {
	var registered = [];

	// register all existing IDs
	$("[id]").each(function () {
		register($(this).attr("id"));
	});

	this.resetRegister = function() {
		registered = [];
	}

	this.generateID = function (string) {
		var normalized = normalize(string);
		var uniqueID = ensureUnique(normalized);
		register(uniqueID);
		return uniqueID;
	};

	function normalize(string) {
		var normalized = string.toLowerCase();
		normalized = normalized.replace(/\W+/g, "-");
		normalized = normalized.replace(/-+/g, "-");

		// if hyphen at end of string
		if (/^-/.test(normalized)) {
			// remove hyphen
			normalized = normalized.slice(1);
		}
		// if hyphen at end of string
		if (/-$/.test(normalized)) {
			// remove hyphen
			normalized = normalized.slice(0, -1);
		}
		return normalized;
	}

	function ensureUnique(string) {
		var count = 2; // starts at 2 because none is 1
		var id = string;
		while (exists(id)) {
			id = string + "-" + count++;
		}
		return id;
	}

	function exists(string) {
		return registered.indexOf(string) !== -1;
	}

	function register(string) {
		registered.push(string);
	}
}
