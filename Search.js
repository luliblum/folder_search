var fs = require('fs');


if (process.argv.length <= 3) {
	console.log("Please add search parameters [EXT] [TEXT]");
	process.exit(-1);
}

var path = __dirname;
//input
console.log("my path is " +path);
var ext = process.argv[2];
var text = process.argv[3];

//---------------------------------------------------------------------------
findRecursive = function (dir, ext, text, done) {
	var results = [];
	fs.readdir(dir, function (err, list) {
		if (err) return done(err);
		var i = 0;
		(function next() {
			var file = list[i++];
			if (!file) return done(null, results);
			file = dir + '/' + file;
			fs.stat(file, function (err, stat) {
				if (stat && stat.isDirectory()) {
					findRecursive(file, ext, text, function (err, res) {
						results = results.concat(res);
						next();
					});
				} else {
					
					if (file.split('.').pop() == ext ){
						let fileContent = fs.readFileSync(file, 'utf8');
						//console.log(fileContent.indexOf(text));

						if(fileContent.indexOf(text) >= 0) {
							results.push(file);
					}
				}
					
					next();
				}
			});
		})();
	});
};
//---------------------------------------------------------------------------
//main program start
console.log("-".repeat(100));
findRecursive(path, ext, text, function (err, itemsFilterd) {

	if (err) throw err;


	if (itemsFilterd && itemsFilterd.length > 0) {
		console.log("Found: (" + itemsFilterd.length + ") Items under '" + path + "'");
		for (var i = 0; i < itemsFilterd.length; i++) {
			console.log(itemsFilterd[i]);
		}
		console.log("-".repeat(100));

	}
	else {
		console.log("No file was found ('" + path + "' with extension: '" + ext + "' and substring: '" + text + "')");
	}
});

//main program end
