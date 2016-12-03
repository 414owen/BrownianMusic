function SpotifyPlugin() {
	result = {};
	function addNewArtist(id) {
		if (this.artists[id] === undefined) {
			this.artists[id] = getNewArtist(name, id);
		}
	}

	// Callback takes a list of names, and a function of what to do on node Add
	result.search = function(artist, callback) {
		superagent.get('https://api.spotify.com/v1/search?q=' + encodeURI(artist) + '&type=artist')
			.end(function(err, results) {
				var searchres = JSON.parse(results.text).artists.items.slice(0, 5).map(
					function(artist) {return {value: artist.name, id: artist.id};}
				);
				callback(searchres);
			});
	};

	result.nodeOnScreen = function(id) {
		artists[id].onScreen = true;
	};

	related = {};

	function firstRelated(id, ids) {
		var rel = related[id];
		for (var i = 0; i < rel.length; i++) {
			if (ids[rel[i].id] === undefined) {
				return rel[i];
			}
		}
		return null;
	}

	result.getRelated = function(id, ids, callback) {
		if (related[id] != null) {
			callback(firstRelated(id, ids));
		} else {
			superagent.get('https://api.spotify.com/v1/artists/' + encodeURI(id) + '/related-artists')
				.end(function(err, relatedans) {
					var results = JSON.parse(relatedans.text).artists;
					related[id] = results.map(function(res) {return {value: res.name, id: res.id};});
					callback(firstRelated(id, ids));
				});
		}
	};
	return result;
};
