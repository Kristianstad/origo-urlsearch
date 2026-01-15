# origo-urlsearch
Url search plugin for Origo.

Minified and compressed versions of the files are available [here](https://nightly.link/Kristianstad/origo-urlsearch/workflows/build-compress/main/urlsearch-compressed-assets.zip).

Initialize with:
`origo.on('load', urlsearch());`

Söker mha sökkontrollen på url-parametern poi eller poim (tex poi=tivoligatan%205). Sätt parametern hideSearchInfo=true för att dölja textrutan med sökresultatet. Man kan även ange en specifik zoomnivå med parametern zoom. (poim är ett legacy-namn och har exakt samma funktion som poi).
