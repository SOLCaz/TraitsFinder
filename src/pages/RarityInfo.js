import React, { useCallback, useEffect, useState } from "react";
import IPFS from "ipfs";
import { createPortal } from 'react-dom';
import MyForm from '../components/MyForm';
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { initIpfs } from '../utils/calc';

const { create } = require('ipfs-http-client');
const client = create('http://localhost:8080'); // (the default in Node.js)

function useQuery() {
    return new URLSearchParams(useLocation().search);
}


function RarityInfo() {

    //const { id: CID, contract } = useParams();
    const first = useQuery().get("first");
    const last = useQuery().get("last");
    const isIPFS = useQuery().get("isIPFS");

    const [CID, setCID] = useState('');
    const [contract, setContract] = useState('');
    const [loading, setLoading] = useState(true);
    const [rarityData, setRarityData] = useState([]);
    const [stateRarity, setStateRarity] = useState([])
    const [nftCollection, setNftCollection] = useState([])
    const [submit, setSubmit] = useState(false);



    //const CID = "QmWCGPXpJMmDbSgRaEXi5E7bvk547sLYUAtG4VpncVKmDk"
    //0x5e198af285388ba69bd2475a2c60ed9a9b55098a

    useEffect(() => {
        setLoading(true);
        const init = async () => {
            const { rarity_data: res, metadata_array: nft_collection } = await initIpfs(CID, first, last, false);
            setRarityData(res);
            setLoading(false);
            console.log(rarityData);
            setNftCollection(nft_collection);
            console.log(nftCollection);
        }
        init();


    }, [submit]);

    useEffect(() => {
        setLoading(true)
    }, []);





    return (
        <div className="App">
            <MyForm CID={CID} setCID={setCID} contract={contract} setContract={setContract} submit={submit} setSubmit={setSubmit}></MyForm>
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
                                const number = nft.name.split('#')[1] || nft.id
                                console.log(number)

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
