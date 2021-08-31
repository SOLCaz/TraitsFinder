import { useHistory } from "react-router-dom";
import { useState } from "react"

function MyForm({ CID, setCID, contract, setContract, submit, setSubmit }) {

    let history = useHistory();
    //const [URI, setURI] = useState('');
    //const [CONTRACT, setCONTRACT] = useState('');
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [checked, setChecked] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        history.push(`?first=${first}&last=${last}&isIPFS=${checked}`)
        setSubmit(!submit)
    }

    const handleURIChange = (e) => {
        setCID(e.target.value)
    }

    const handleContractChange = (e) => {
        setContract(e.target.value)
    }

    const handleFirstChange = (e) => {
        setFirst(e.target.value)
    }

    const handleLastChange = (e) => {
        setLast(e.target.value)
    }

    const handleToggle = (e) => {
        setChecked(e.target.checked)
    }


    return (
        <form onSubmit={e => { handleSubmit(e) }}>
            <label>apiURL:
                <input type="text" name="apiURL" onChange={handleURIChange} />
            </label>
            <input type="checkbox" onChange={handleToggle} name="checkBox" />
            <label>contract address:
                <input type="text" name="address" onChange={handleContractChange} />
            </label>
            <label>first id:
                <input type="text" name="first" onChange={handleFirstChange} />
            </label>
            <label>last id:
                <input type="text" name="last" onChange={handleLastChange} />
            </label>
            <input type="submit" value="Submit" />
        </form>
    )
}


export default MyForm