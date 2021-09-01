
function TraitsTable({ trait }) {

    return (
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
    )
}

export default TraitsTable;