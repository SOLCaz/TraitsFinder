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
async function initIpfs(CID, collection_size) {

    //Utilisation de l'HTTP client => le serveur doit faire tourner sa propre node IPFS

    //const node = await IPFS.create()

    //tableau de promises vide
    var metadata_array = [];


    //On stocke chaque promise dans le tableau sans attendre le retour de la précédente
    for (let i = 1; i <= collection_size; i++) {
        let fullpath = CID + '/' + i.toString();
        const stream = client.cat(fullpath);
        try {
            const result = await getChunks(stream);
            metadata_array.push(result);
        } catch (err) {
            console.log(err);
        }
    }

    let rarity_data = calc_collection_rarity(metadata_array, collection_size);
    calc_mint_rarity(metadata_array, rarity_data)
    metadata_array.sort((a, b) => a.rarity_score - b.rarity_score)
    console.log(metadata_array)
    return { rarity_data: rarity_data, metadata_array: metadata_array };

}

function calc_mint_rarity(metadata_array, rarity_data) {
    metadata_array.forEach((object) => {
        let rarity_score = 1;
        object.attributes.forEach((attribute) => {
            let type = rarity_data.traits_types.find(o => o.name === attribute.trait_type);
            let value = type.values.find(o => o.name === attribute.value)
            console.log(value)
            //console.log(trait_type_info.values[index].name, "===", trait_value.toString())
            rarity_score *= +value.absoluteRate


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
function calc_collection_rarity(metadata_array, collection_size) {
    var propertyToTrait = {
        "traits_types": [
        ]
    }


    metadata_array.forEach((object) => {

        object.attributes.forEach((attribute) => {

            //Si le TYPE existe on INCREMENTE LE COMPTE
            let type = propertyToTrait.traits_types.find(o => o.name === attribute.trait_type)
            if (type !== undefined) {
                type.count++;
                //Si la VALEUR existe on INCREMENTE sinon on la CREE et INITIALISE
                let value = type.values.find(o => o.name === attribute.value)
                if (value !== undefined) {
                    value.count++;
                }
                else {
                    type.values.push({ "name": attribute.value, "count": 1 })
                }
                //Si le TYPE n'existe PAS alors la VALEUR NON PLUS
            } else {
                propertyToTrait.traits_types.push({ "name": attribute.trait_type, "values": [{ "name": attribute.value, "count": 1 }], "count": 1 })
            }

        });


    });


    propertyToTrait.traits_types.forEach((property) => {
        property['propertyRate'] = property['count'] / collection_size * 100;
        property['values'].forEach((value) => {
            value['relativeRate'] = ((value['count'] / property['count'])) * 100
            value['absoluteRate'] = ((value['count'] / property['count']) * 100 * property['propertyRate'] / 100)
        })
    })


    return propertyToTrait;

}



function RarityInfo() {

    const { id: CID, contract, size } = useParams();


    const [loading, setLoading] = useState(true);
    const [rarityData, setRarityData] = useState([]);
    const [stateRarity, setStateRarity] = useState([])
    const [nftCollection, setNftCollection] = useState([])


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
            const { rarity_data: res, metadata_array: nft_collection } = await initIpfs(CID, size);
            setRarityData(res)
            setLoading(false);
            console.log(rarityData)
            setNftCollection(nft_collection)
            console.log(nftCollection)
            //const myRarity = await getRarityById(CID, 390);
            //setStateRarity(myRarity)
        }
        init();


    }, []);





    return (
        <div className="App">
            <MyForm></MyForm>
            {loading === true ? <p>loading</p> :
                <>
                    <div>
                        {
                            rarityData.traits_types.map((trait) => {
                                return (
                                    <div>
                                        <h2>{trait.name} : {trait.propertyRate} %</h2>
                                        {trait.values.map((value) => {
                                            return (
                                                <li>{value.name}, {value.absoluteRate} %</li>
                                            );
                                        })
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div>
                        {
                            nftCollection.map((nft) => {
                                const number = nft.name.split('#')[1]
                                console.log(number)

                                return (
                                    <p>
                                        openSeaLink : <a href={`https://opensea.io/assets/${contract}/${number}`}>{number}</a>
                                    </p>
                                );
                            })
                        }

                    </div>
                </>


            }

        </div>
    );
}

export default RarityInfo;
