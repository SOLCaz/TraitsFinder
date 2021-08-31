import styled from "styled-components";
import { css } from "styled-components";
import Rank from "../components/RankTable";
import "../styles/RankTable.css"

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
        <div id="rankDiv">
            <table id="rankTable">
                <thead>
                    <tr>
                        <th>Ranking</th>
                        <th>Collection ID</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        nftDataArray !== undefined && nftDataArray.map((nft, index) => {
                            //const number = nft.image.split('/').pop();
                            //const number = nft.image.split(CID + '/')[1].split(".")[0] || nft.id
                            const number = nft["id"];
                            let url = `https://opensea.io/assets/${contract}/${number}`;

                            return (
                                <tr>
                                    <td>
                                        #{index + 1}
                                    </td>
                                    <td>
                                        <a href={url}>#{number}</a>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default RankTable;