import React, { useCallback, useEffect, useState } from "react";
import IPFS from "ipfs";
import { createPortal } from 'react-dom';
import MyForm from '../components/MyForm';
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { sendRequests, buildPromise, getCollectionData } from '../utils/calc';

const { create } = require('ipfs-http-client');
const client = create('http://localhost:8080'); // (the default in Node.js)

function useQuery() {
    return new URLSearchParams(useLocation().search);
}


function RarityInfo() {

    //const { id: CID, contract } = useParams();
    const first = Number(useQuery().get("first"));
    const last = Number(useQuery().get("last"));
    const isIPFS = useQuery().get("isIPFS") === 'true';

    const [CID, setCID] = useState('');
    const [contract, setContract] = useState('');
    const [loading, setLoading] = useState(true);
    const [rarityData, setRarityData] = useState();
    const [stateRarity, setStateRarity] = useState([])
    const [nftDataArray, setNftDataArray] = useState([])
    const [submit, setSubmit] = useState(true);



    //const CID = "QmWCGPXpJMmDbSgRaEXi5E7bvk547sLYUAtG4VpncVKmDk"
    //0x5e198af285388ba69bd2475a2c60ed9a9b55098a



    useEffect(() => {
        setLoading(true);
        const init = async () => {

            let promises = [];
            let metadata_array = [];

            for (let i = first; i <= last; i++) {

                if (i % 3 === 0 || i === last) {
                    let collection_size = i - first + 1;
                    console.log(collection_size)

                    buildPromise(CID, i, isIPFS, promises);
                    let new_data = await sendRequests(first, i, promises)
                    new_data.forEach((data) => {
                        metadata_array.push(data)
                    });

                    const { rarity_data, _nftDataArray } = getCollectionData(metadata_array, collection_size);
                    setRarityData(rarity_data);
                    setNftDataArray(_nftDataArray);

                    promises = [];

                } else {
                    await buildPromise(CID, i, isIPFS, promises);
                }

            }

        }
        setLoading(true);

        init();


    }, [submit]);



    useEffect(() => {
        setLoading(true);
    }, []);

    useEffect(() => {
        console.log(rarityData);
        setLoading(false);

    }, [rarityData]);





    return (
        <div className="App">
            <MyForm CID={CID} setCID={setCID} contract={contract} setContract={setContract} submit={submit} setSubmit={setSubmit}></MyForm>
            {loading === true ? <p>loading</p> :
                <>
                    <div>
                        {
                            rarityData !== undefined && rarityData.traits_types.map((trait) => {
                                return (
                                    <div>
                                        <table>
                                            <tr>
                                                <th>
                                                    <h2>{trait.name} : {trait.propertyRate} %</h2>
                                                </th>
                                            </tr>
                                            {trait.values.map((value) => {
                                                return (
                                                    <tr><td>{value.name}</td> <td>{value.absoluteRate} %</td></tr>
                                                );
                                            })
                                            }
                                        </table>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div>
                        {
                            nftDataArray !== undefined && nftDataArray.map((nft) => {
                                const number = nft.name.split('#')[1] || nft.id

                                return (
                                    <p>
                                        openSeaLink : <a href={`https://opensea.io/assets/${contract}/${number}`}>#{number}</a>
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
