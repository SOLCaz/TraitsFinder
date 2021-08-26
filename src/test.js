import React, { useCallback, useEffect, useState } from "react";
import IPFS from "ipfs";
import { createPortal } from 'react-dom';
import MyForm from '../components/MyForm';
import { useParams } from "react-router-dom";

const { create } = require('ipfs-http-client')
const client = create('http://localhost:8080'); // (the default in Node.js)

/**
 * 
 * @param {string} CID 
 */
async function initIpfs(CID) {

    //Utilisation de l'HTTP client => le serveur doit faire tourner sa propre node IPFS

    //const node = await IPFS.create()

    //tableau de promises vide
    var metadata_array = [];
    var scanned_number = 100;

    //On stocke chaque promise dans le tableau sans attendre le retour de la précédente
    for (let i = 1; i <= scanned_number; i++) {
        let fullpath = CID + '/' + i.toString();
        const stream = client.cat(fullpath);
        try {
            const result = await getChunks(stream);
            metadata_array.push(result);
        } catch (err) {
            console.log(err);
        }
    }

    let rarity_data = calc_collection_rarity(metadata_array, scanned_number);
    calc_mint_rarity(metadata_array, rarity_data)
    metadata_array.sort((a, b) => a.rarity_score <= b.rarity_score)
    console.log(rarity_data)
    console.log(metadata_array)
    return { rarity_data: rarity_data, metadata_array: metadata_array };

}

function calc_mint_rarity(metadata_array, rarity_data) {
    metadata_array.forEach((object) => {
        let rarity_score = 1;
        object.attributes.forEach((attribute) => {
            let trait_type = attribute.trait_type
            let trait_value = attribute.value
            let trait_type_info = rarity_data[trait_type.toString()]
            console.log(trait_value)

            console.log(trait_type_info)
            let index = trait_type_info.values.findIndex(obj => obj.name = trait_value.toString())
            //console.log(trait_type_info.values[index].name, "===", trait_value.toString())
            rarity_score *= trait_type_info.values[index].absoluteRarity


        })
        // console.log(object)
        // console.log(rarity_score)
        object["rarity_score"] = rarity_score;

    })
    //console.log(metadata_array)
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
        //console.log(data)
        return data;
    }
}

/**
 * 
 * @param {*} metadata_array les données de l'ensemble des objets de la collection
 * 
 */
function calc_collection_rarity(metadata_array, scanned_number) {
    //Contient une map(trait,nombre) décompte du nombre de possesseurs de chaque propriété
    var propertyCount = {}
    //Détient le nombre d'apparences de chaque valeur de trait (value:nombre)
    var traitAmountObj = {}
    //Lier propriété et trait
    var traitToProperty = {}
    //
    var propertyToTrait = {
        'trait_type': {
            'name': "tbd",
            'count': "tbd",
        },
    }

    var propertytoTrait = new Map();

    metadata_array.forEach((object) => {

        object.attributes.forEach((attribute) => {

            if (attribute.trait_type in propertyToTrait) {
                if (attribute.value in propertyToTrait[attribute.trait_type]) {
                    propertyToTrait[attribute.trait_type][attribute.value]['count']++;
                } else {
                    propertyToTrait[attribute.trait_type][attribute.value] = {}
                    propertyToTrait[attribute.trait_type][attribute.value]['count'] = 1;
                }
            } else {
                propertyToTrait = {};
                console.log(propertyToTrait)

                propertyToTrait['trait_type'] = {};
                console.log(propertyToTrait)

                propertyToTrait['trait_type'][attribute.trait_type] = {};
                console.log(propertyToTrait)

                propertyToTrait[attribute.trait_type][attribute.value] = {};
                propertyToTrait[attribute.trait_type][attribute.value]['count'] = 1;
            }
            //Incrémenter le nombre de possesseurs de la propriété
            propertyCount[attribute.trait_type] = propertyCount[attribute.trait_type] + 1 || 1
            //Incrémenter le nombre de possesseurs du trait
            traitAmountObj[attribute.value] = traitAmountObj[attribute.value] + 1 || 1
            //Lier le trait à sa propriété
            traitToProperty[attribute.value] = attribute.trait_type
            console.log(propertyToTrait)

        });
        //console.log(traitToProperty)
        //console.log(traitAmountObj)
        //console.log(object)

    });


    //une fois qu'on a récupéré tous les traits/propriétés => on fait le bilan global

    var result = {}

    // for (let property in propertyCount) {
    //     const propertyAmount = propertyCount[property];
    //     const propertyRate = (propertyAmount / scanned_number) * 100;
    //     const traitsList = getPropertyByTrait(traitAmountObj, traitToProperty, property, propertyAmount, propertyRate);
    //     result[property] = { propertyAmount: propertyAmount, propertyRate: propertyRate, values: traitsList }
    // }

    for (let property in propertyToTrait) {
        const getPropertyAmount = ((property) => {
            let sum = 0;
            for (let trait_value in property) {
                sum += property[trait_value]['count'];
                console.log(property[trait_value])

            }
            return sum;
        });
        const propertyAmount = getPropertyAmount(property);
        const propertyRate = (propertyAmount / scanned_number) * 100;
        console.log(property)

        // for (let trait_value in property) {
        //     console.log(trait_value)

        //     property[trait_value]['relativeRarity'] = ((property[trait_value]['count'] / propertyAmount) * 100).toFixed(2);
        //     property[trait_value]['absoluteRarity']((property[trait_value]['count'] / propertyAmount) * propertyRate / 100 * 100).toFixed(2)
        // }


    }

    //console.log(propertyCount)
    //console.log(result)
    return result;

}

/**
 * 
 * @param {*} traitAmountObj objet(trait=>amount of times the traits appears)
 * @param {*} traitToProperty object(trait => property)
 * @param {*} property (the property we want to get all the details from)
 * @returns traitsList, list of all the traits and their occurences in the collection
 */
function getPropertyByTrait(traitAmountObj, traitToProperty, property, propertyAmount, propertyRate) {
    let traitsList = []
    for (let trait in traitToProperty) {
        if (traitToProperty[trait] === property) {
            const traitAmount = traitAmountObj[trait]
            const relativeRarity = ((traitAmount / propertyAmount) * 100).toFixed(2)
            const absoluteRarity = ((traitAmount / propertyAmount) * propertyRate / 100 * 100).toFixed(2)
            traitsList.push({ name: trait, traitAmount: traitAmount, relativeRarity: relativeRarity, absoluteRarity: absoluteRarity })

        }
    }
    traitsList.sort((b, a) => a.traitAmount - b.traitAmount)
    return traitsList;

}


function RarityInfo() {

    const { id: CID } = useParams();


    const [loading, setLoading] = useState(true);
    const [rarityData, setRarityData] = useState([]);
    const [stateRarity, setStateRarity] = useState([])


    //const CID = "QmWCGPXpJMmDbSgRaEXi5E7bvk547sLYUAtG4VpncVKmDk"

    async function getRarityById(CID, mintId) {

        let fullpath = CID + '/' + mintId.toString();
        const stream = client.cat(fullpath);
        try {
            const result = await getChunks(stream);
            console.log(result)
            result.attributes.forEach((attribute) => {
                const trait_type = attribute.trait_type;
                console.log(trait_type)

            })

        } catch (err) {
            console.log(err);
        }

    }


    useEffect(() => {
        setLoading(true)
        const init = async () => {
            const { rarity_data: res } = await initIpfs(CID);
            setRarityData(res)
            setLoading(false);
            console.log(rarityData)
            // const myRarity = await getRarityById(CID, 390);
            // setStateRarity(myRarity)
        }
        init();


    }, []);





    return (
        <div className="App">
            <MyForm></MyForm>
            {loading === true ? <p>loading</p> :
                <div>
                    {Object.entries(rarityData).map(([key, value]) => {
                        return (
                            <div>
                                <h2>{key} : {value.propertyRate} %</h2>
                                {value.values.map((entry) => {
                                    return (<p>{entry.name} : {entry.traitAmount} : Relative : {entry.relativeRarity}%, Absolute: {entry.absoluteRarity}</p>)
                                })}
                            </div>

                        )
                    }
                    )}
                </div>


            }

        </div>
    );
}

export default RarityInfo;
