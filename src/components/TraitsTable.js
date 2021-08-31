import styled from "styled-components";
import { css } from "styled-components";
import '../styles/TraitsTable.css'

function TraitsTable({ trait }) {

	return (
		<div>
			<table className="lol">
				<thead>
					<tr>
						<th>
							<h3>{trait.name} : {trait.propertyRate.toFixed(4)} %</h3>
						</th>

					</tr>
				</thead>
				<tbody>
					{trait.values.map((value) => {
						return (
							<tr><td>{value.name}</td> <td>{value.absoluteRate.toFixed(4)} %</td></tr>
						);
					})
					}
				</tbody>
			</table>
		</div>
	)
}

export default TraitsTable;