import logo from './logo.svg';
import './App.css';
import React, { useCallback, useEffect, useState } from "react";
import IPFS from "ipfs";
import { createPortal } from 'react-dom';
import MyForm from './components/MyForm';
import { useParams } from "react-router-dom";

const { create } = require('ipfs-http-client')

/**
 * 
 * @param {string} CID 
 */
async function initIpfs(CID) {

	//Utilisation de l'HTTP client => le serveur doit faire tourner sa propre node IPFS
	const client = create('http://localhost:8080') // (the default in Node.js)
	//const node = await IPFS.create()

	//tableau de promises vide
	var metadata_array = [];

	//On stocke chaque promise dans le tableau sans attendre le retour de la précédente
	for (let i = 1; i < 30; i++) {
		let fullpath = CID + '/' + i.toString();
		const stream = client.cat(fullpath)
		try {
			const result = await getChunks(stream);
			metadata_array.push(result);
		} catch (err) {
			console.log(err)
		}
	}

	calc_rarity(metadata_array);

}

/**
 * 
 * @param {*} stream 
 * @returns json-object of queryied data
 */
async function getChunks(stream) {
	let data = ''
	for await (const chunk of stream) {
		// chunks of data are returned as a Buffer, convert it back to a string
		data = JSON.parse(new TextDecoder().decode(chunk))
		console.log(data)
		return data;
	}
}

/**
 * 
 * @param {*} metadata_array les données de l'ensemble des objets de la collection
 * 
 */
function calc_rarity(metadata_array) {
	//Contient une map(trait,nombre) décompte du nombre de possesseurs de chaque propriété
	var propertyCount = {}
	//Détient le nombre d'apparences de chaque valeur de trait (value:nombre)
	var traitAmountObj = {}
	//Lier propriété et trait
	var traitToProperty = {}

	metadata_array.forEach((object) => {

		object.attributes.forEach((attribute) => {
			//Incrémenter le nombre de possesseurs de la propriété
			propertyCount[attribute.trait_type] = propertyCount[attribute.trait_type] + 1 || 1
			//Incrémenter le nombre de possesseurs du trait
			traitAmountObj[attribute.value] = traitAmountObj[attribute.value] + 1 || 1
			//Lier le trait à sa propriété
			traitToProperty[attribute.value] = attribute.trait_type

		});
		console.log(traitToProperty)
		console.log(traitAmountObj)
		console.log(object)

	});

	//une fois qu'on a récupéré tous les traits/propriétés => on fait le bilan global

	var result = {}

	for (let property in propertyCount) {
		const propertyAmount = propertyCount[property];
		const traitsList = getPropertyByTrait(traitAmountObj, traitToProperty, property);
		result[property] = { propertyAmount: propertyAmount, values: traitsList }
	}

	console.log(propertyCount)
	console.log(result)

}

/**
 * 
 * @param {*} traitAmountObj objet(trait=>amount of times the traits appears)
 * @param {*} traitToProperty object(trait => property)
 * @param {*} property (the property we want to get all the details from)
 * @returns traitsList, list of all the traits and their occurences in the collection
 */
function getPropertyByTrait(traitAmountObj, traitToProperty, property) {
	let traitsList = []
	for (let trait in traitToProperty) {
		if (traitToProperty[trait] === property) {
			const traitAmount = traitAmountObj[trait]
			traitsList.push({ name: trait, traitAmount: traitAmount })

		}
	}
	traitsList.sort((a, b) => a.traitAmount - b.traitAmount)
	return traitsList;

}



function App() {

	const [loading, setLoading] = useState(true);
	const [loadData, setLoadData] = useState(true);

	const CID = "QmWCGPXpJMmDbSgRaEXi5E7bvk547sLYUAtG4VpncVKmDk"

	useEffect(() => {
		setLoading(true)
		const init = async () => {
			await initIpfs(CID);
			setLoading(false);
		}
		init();

	}, []);

	return (
		<div className="App">
			{loading === true ? <p>loading</p> : <p> not Loading</p>}
			<MyForm></MyForm>
		</div>
	);
}

export default App;
