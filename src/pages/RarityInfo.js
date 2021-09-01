import React, { useCallback, useEffect, useState, useRef } from "react";
import IPFS from "ipfs";
import { createPortal } from 'react-dom';
import MyForm from '../components/MyForm';
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { sendRequests, buildPromise, getCollectionData } from '../utils/calc';
import TraitsTable from "../components/TraitsTable";
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import styled from "styled-components";
import RankTable from "../components/RankTable";
import "../styles/TraitsTable.css"
import { Spinner, ProgressBar } from "react-bootstrap";

const TwoColumns = styled.div`
    display:grid;
    margin-right:25%;
    margin-left:25%;
    grid-template-columns: 50% 50%;
    grid-auto-rows: minmax(min-content, max-content);
`

const OneColumn = styled.div`
    display:grid;
    margin-right:15%;
    margin-left:15%;
    grid-template-columns: 100%;
    grid-auto-rows: minmax(min-content, max-content);
`
const StatusWrapper = styled.div`
    margin:10px;
    display:grid;
    margin-right:25%;
    margin-left:25%;
    grid-template-columns: 100%;
    width:50%;
    jusitfy-content:center;
    align-items:center;
`



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
    const isFirstRun = useRef(true);
    const isFirstRun2 = useRef(true);
    const [status, setStatus] = useState('1');


    const nbOfRequests = 100

    //const CID = "QmWCGPXpJMmDbSgRaEXi5E7bvk547sLYUAtG4VpncVKmDk"
    //0x5e198af285388ba69bd2475a2c60ed9a9b55098a



    useEffect(() => {
        setLoading(true);
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        const init = async () => {

            let promises = [];
            let metadata_array = [];
            const collection_size = last - first + 1;

            for (let i = first; i <= last; i++) {

                if (i % nbOfRequests === 0 || i === last) {
                    let analyzed_size = i - first + 1;

                    buildPromise(CID, i, isIPFS, promises);
                    let new_data = await sendRequests(first, i, promises)
                    new_data.forEach((data) => {
                        metadata_array.push(data)
                    });

                    const { rarity_data, _nftDataArray } = getCollectionData(metadata_array, analyzed_size);
                    setRarityData(rarity_data);
                    setNftDataArray(_nftDataArray);

                    promises = [];
                    const progress = (((i - first) / collection_size) * 100).toFixed(0)
                    setStatus(progress)

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

        if (isFirstRun2.current) {
            isFirstRun2.current = false;
            return;
        }
        setLoading(false);

    }, [rarityData]);





    return (
        <div className="App">

            <MyForm CID={CID} setCID={setCID} contract={contract} setContract={setContract} submit={submit} setSubmit={setSubmit}></MyForm>
            {(loading === true || isFirstRun.current === true) ? <p>loading</p> :
                <>
                    <StatusWrapper>
                        <ProgressBar variant="success" animated now={status} label={`${status}%`} />
                    </StatusWrapper>
                    <h2 style={{ 'text-align': "center" }}>Traits Rarity </h2>
                    <TwoColumns>
                        {
                            rarityData !== undefined && rarityData.traits_types.map((trait) => {
                                return (
                                    <TraitsTable trait={trait}></TraitsTable>
                                );
                            })
                        }
                    </TwoColumns>
                    <div>
                        <h2 style={{ 'text-align': "center" }}>Rarity Rank </h2>

                        <OneColumn>
                            <RankTable nftDataArray={nftDataArray} contract={contract} />
                        </OneColumn>
                    </div>
                </>


            }

        </div>
    );
}

export default RarityInfo;
