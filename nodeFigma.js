// require('dotenv').config(); //dunno if this is necessary
const fetch = require('node-fetch'); //fetch behaviour
const fs = require('fs'); //file system
const figma = require('./lib/figma');

const headers = new fetch.Headers();
const componentList = [];
let devToken = '334391-0f3a8f2f-76ae-44f8-bf53-96a2128e29a5';

if (process.argv.length < 3) {
	console.log('Usage: node setup.js <file-key> [figma-dev-token]');
	process.exit(0);
}

if (process.argv.length > 3) {
	devToken = process.argv[3];
}

headers.append('X-Figma-Token', devToken);

const fileKey = process.argv[2];
const baseUrl = 'https://api.figma.com';

// const vectorMap = {};
// const vectorList = [];
// const vectorTypes = ['VECTOR', 'LINE', 'REGULAR_POLYGON', 'STAR'];

//shit begins after this
//shit begins after this
//shit begins after this

//DON'T DELETE
//DON'T DELETE
// function preprocessTree(node) {
// 	//this code runs once per frame with !
// 	let vectorsOnly = node.name.charAt(0) !== '!'; //things that don't start with !
// 	let vectorVConstraint = null;
// 	let vectorHConstraint = null;

// 	if (vectorTypes.indexOf(node.type) >= 0) {
// 		//if the node is vector
// 		// node.type = 'VECTOR';
// 		// vectorMap[node.id] = node;
// 		vectorList.push(node.id); //adds to vectorlist
// 		node.children = [];
// 	}

// 	if (node.children) {
// 		//if there are children
// 		for (const child of node.children) {
// 			preprocessTree(child); //oh it's recursive baybee
// 		}
// 	}
// }
//DON'T DELETE
//DON'T DELETE

async function main() {
	let resp = await fetch(`${baseUrl}/v1/files/${fileKey}?geometry=paths`, {
		headers,
	});
	let data = await resp.json(); //data is what comes back from API request

	const doc = data.document; //figma document
	const figmaFile = doc.children; //only grabbing first child = first page in project
	// const canvas = doc.children[0]; //only grabbing first child = first page in project
	//this is where I gotta call diffo pages

	// const canvas2 = doc.children[0]; //only grabbing first child = first page in project

	//GRAB THE BACKGROUND IMAGES:
	let respImages = await fetch(`${baseUrl}/v1/files/${fileKey}/images`, {
		headers,
	});
	let imageFillJSON = await respImages.json(); //data is what comes back from API request
	// if (!imageFills.error && imageFills.meta.images)
	const imageFills = imageFillJSON.meta.images || {};

	//DON'T DELETE
	//DON'T DELETE
	// for (let j = 0; j < figmaFile.length; j++) {
	// 	for (let i = 0; i < figmaFile[j].children.length; i++) {
	// 		//for each child  of canvas
	// 		const child = figmaFile[j].children[i];
	// 		if (child.name.charAt(0) === '!' && child.visible !== false) {
	// 			// preprocessTree(child); //run preprocess function?
	// 			//for each frame
	// 		}
	// 	}
	// }

	//okay soooo it's unclear to me what "preprocess" does…
	//maybe it cleans up files if there's a bunch of extra stuff?
	//or stuff the system isn't expecting?
	//DON'T DELETE
	//DON'T DELETE

	//is this where it grabs SVGs? what's vectorList?
	//does it get populated by preprocess?
	//GU IDS ??
	// let guids = vectorList.join(','); //this grabs the vectors?

	// let svgData = await fetch(`${baseUrl}/v1/images/${fileKey}?ids=${guids}&format=svg`, { headers });

	// //grabs svgs of vectorList
	// const svgJSON = await svgData.json(); //makes json out of them
	// const svgs = svgJSON.images || {}; //if images exist?
	// if (svgs) {
	// 	//if images exist, process like this?
	// 	let promises = [];
	// 	let guids = [];
	// 	for (const guid in svgs) {
	// 		if (svgs[guid] == null) continue;
	// 		guids.push(guid);
	// 		promises.push(fetch(svgs[guid]));
	// 	}

	// 	let responses = await Promise.all(promises);
	// 	promises = [];
	// 	for (const resp of responses) {
	// 		promises.push(resp.text());
	// 	}

	// 	responses = await Promise.all(promises);
	// 	for (let i = 0; i < responses.length; i++) {
	// 		//replace svg with svg preserveAspectRatio none
	// 		svgs[guids[i]] = responses[i]
	// 			.replace('<svg ', '<svg preserveAspectRatio="none" ')
	// 			.replace(/[\n\r]+/g, '');
	// 	}
	// }

	let contents = `export const figmaProject = [`; //this is what eventually gets written to filesystem

	for (let j = 0; j < figmaFile.length; j++) {
		if (figmaFile[j].name.charAt(0) !== '!') {
			const componentMap = {}; //empty object for putting stuff in?

			let nextSection = ''; //container for what is to be added to 'contents'

			for (let i = 0; i < figmaFile[j].children.length; i++) {
				//for each artboard
				const child = figmaFile[j].children[i]; //child variable
				if (child.name.charAt(0) === '!' && child.visible !== false) {
					//if named & visible
					figma.createComponent(child, imageFills, componentMap);
					//hit figma lib
					//pass the frame and images?
					//returns object & updates componentMap object
				}
			}

			// console.log(componentMap);
			//so at this point, componentMap has {name, doc(aka html to write), instance} plus a key i don't understand (16:0?)

			for (const key in componentMap) {
				// contents += `  if (id === "${key}") return ${componentMap[key].instance};\n`;
				nextSection += "'" + componentMap[key].doc + "',";
				//write that thing in componentMap to nextSection
			}

			//here is where to start json
			contents +=
				// '<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8" /> <meta name="viewport" content="width=device-width,initial-scale=1" /><title>Svelte app</title><link rel="stylesheet" href="./global.css" /></head><body>';
				`{ name: "${figmaFile[j].name}", stories:[`;
			contents += nextSection; //append nextSection to contents
			// contents += '</body></html>';
			contents += ']}, ';
		}
	}
	contents += ' ];';

	//here is where to end json

	const path = './src/figmaExport.js'; //so here, it writes one file.
	//here is where it could change to multiple files, one per project/frame
	fs.writeFile(path, contents, function (err) {
		//write the file
		if (err) console.log(err);
		console.log(`wrote ${path}`);
	});
}

main().catch((err) => {
	//run main
	console.error(err);
	console.error(err.stack);
});
