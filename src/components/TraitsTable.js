import styled from "styled-components";
import { css } from "styled-components";
import '../styles/TraitsTable.css'

function TraitsTable({ trait }) {

	return (

		<div className="divTraits">
			<table className="tableTraits">
				<thead className="theadTraits">
					<tr className="trTraits">
						<th className="thTraits">
							<h3>{trait.name} : {trait.propertyRate.toFixed(4)} %</h3>
						</th>

					</tr>
				</thead>
				<tbody className="tbodyTraits">
					{trait.values.map((value) => {
						return (
							<tr className="trTraits"><td className="tdTraits">{value.name}</td> <td>{value.absoluteRate.toFixed(4)} %</td></tr>
						);
					})
					}
				</tbody>
			</table>
		</div>
	)
}

export default TraitsTable;