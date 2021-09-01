import styled from "styled-components";
import { css } from "styled-components";
import Rank from "../components/RankTable";
import "../styles/TraitsTable.css"

const StyledLink = styled.a`
    color:#04BD01;
`

function RankTable({ nftDataArray, contract }) {


    return (
        <div className="divSplitOne">
            <div className="divRank">
                <table className="tableRank">
                    <thead>
                        <tr>
                            <th>Ranking</th>
                            <th>Collection ID</th>
                        </tr>
                    </thead>
                    <tbody className="tbodyRank">
                        {
                            nftDataArray !== undefined && nftDataArray.map((nft, index) => {
                                //const number = nft.image.split('/').pop();
                                //const number = nft.image.split(CID + '/')[1].split(".")[0] || nft.id
                                const number = nft["id"];
                                let url = `https://opensea.io/assets/${contract}/${number}`;

                                return (
                                    <tr>
                                        <td className="tdRank">
                                            {index + 1}
                                        </td>
                                        <td className="tdRank">
                                            <StyledLink href={url}>#{number}</StyledLink>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RankTable;