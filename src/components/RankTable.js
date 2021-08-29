import styled from "styled-components";
import { css } from "styled-components";
import Rank from "../components/RankTable";


const Table = styled.table`
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    border-radius: 1em;
  	overflow: hidden;
    width: 90%;
	justify-self:center;
	align-self:start;
	margin:10px;
`
const sharedStyle = css`
    border: 1px solid #ddd;
    padding: 8px;
`
const Head = styled.th`

    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #04AA6D;
    color: white;
`
const Row = styled.tr`
    background-color: #f2f2f2;
    &:hover {
        background-color: #ddd;
    }

`
const Data = styled.td`
    ${sharedStyle};

`
const RankTD = styled.td`

`

const RankWrapper = styled.div`
    
`

function RankTable({ nftDataArray, contract }) {


    return (
        <Table>
            <Row>
                <Head>Ranking</Head>
                <Head>Collection ID</Head>
            </Row>
            {
                nftDataArray !== undefined && nftDataArray.map((nft, index) => {
                    //const number = nft.image.split('/').pop();
                    //const number = nft.image.split(CID + '/')[1].split(".")[0] || nft.id
                    const number = nft["id"];
                    let url = `https://opensea.io/assets/${contract}/${number}`;

                    return (
                        <Row>
                            <Data>
                                #{index + 1}
                            </Data>
                            <Data>
                                <a href={url}>#{number}</a>
                            </Data>
                        </Row>
                    );
                })
            }
        </Table>
    )
}

export default RankTable;