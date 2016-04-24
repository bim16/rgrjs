
import fs from 'fs'
import express from 'express';
import Schema from './data/schema';
import GraphQLHTTP from 'express-graphql';
import {graphql} from 'graphql';
import {introspectionQuery} from 'graphql/utilities';

import {MongoClient} from 'mongodb'

let app = express();
app.use(express.static('public'));

(async () => {
	try {
		let db = await MongoClient.connect("mongodb://sa:Rose12@ds013579.mlab.com:13579/rgrjs");
		let schema = Schema(db);

		app.use('/graphql', GraphQLHTTP({
			schema,
			graphiql: true
		}));

		app.listen(3000, () => console.log('Listening on port 3000'));

		// Generate schema.json
		let json = await graphql(schema, introspectionQuery);
		fs.writeFile('./data/schema.json', JSON.stringify(json, null, 2), err => {
			if (err) throw err;

			console.log("JSON schema created");
		});
	} catch(e) {
		console.log(e);
	}
})();

/*
let db;
MongoClient.connect("mongodb://sa:Rose12@ds013579.mlab.com:13579/rgrjs", (err, database) => {
	if (err) throw err;

	db = database;
	app.use('/graphql', GraphQLHTTP({
		schema: schema(db),
		graphiql: true
	}));

	app.listen(3000, () => console.log('Listening on port 3000'));
});
*/

// app.get("/data/links", (req, res) => {
// 	db.collection("links").find({}).toArray((err, links) => {
// 		if (err) throw err;

// 		res.json(links);
// 	});
// });
