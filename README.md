# origo-urlsearch
Url search plugin for Origo.

Söker mha sökkontrollen på url-parametern poi eller poim (tex poi=tivoligatan%205). Sätt parametern hideSearchInfo=true för att dölja textrutan med sökresultatet. Man kan även ange en specifik zoomnivå med parametern zoom. (poim är ett legacy-namn och har exakt samma funktion som poi).

Initiera med:
`origo.api().on('load', urlsearch(););`
