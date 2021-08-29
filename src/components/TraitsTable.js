import styled from "styled-components";
import { css } from "styled-components";


const TableWrapper = styled.div`
	height:500px;
   width:100%%;
   overflow-x:scroll;
   margin:30px;
`
const Table = styled.table`
	display:table;
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
    border-radius:10px;
    border: 1px solid #ddd;
    padding: 8px;
`
const TH = styled.th`

    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #04AA6D;
    color: white;
`
const TR = styled.tr`
	width:100%;
    background-color: #f2f2f2;
    &:hover {
        background-color: #ddd;
    }

`
const TD = styled.td`
    ${sharedStyle};

`

const THEAD = styled.thead`
`

const TBODY = styled.tbody`
	
`
function TraitsTable({ trait }) {

	return (
		<TableWrapper>
			<Table>
				<THEAD>
					<TR>
						<TH>
							<h2>{trait.name} : {trait.propertyRate.toFixed(4)} %</h2>
						</TH>
						<TH>

						</TH>
					</TR>
				</THEAD>
				<TBODY>
					{trait.values.map((value) => {
						return (
							<TR><TD>{value.name}</TD> <TD>{value.absoluteRate.toFixed(4)} %</TD></TR>
						);
					})
					}
				</TBODY>
			</Table>
		</TableWrapper>
	)
}

export default TraitsTable;