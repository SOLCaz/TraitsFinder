import { useHistory } from "react-router-dom";
import { useState } from "react"

function MyForm() {

    let history = useHistory();
    const [URI, setURI] = useState('');
    const [CONTRACT, setCONTRACT] = useState('');
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        history.push(`/${URI}/${CONTRACT}?first=${first}&last=${last}`)
    }

    const handleURIChange = (e) => {
        setURI(e.target.value)
    }

    const handleContractChange = (e) => {
        setCONTRACT(e.target.value)
    }

    const handleFirstChange = (e) => {
        setFirst(e.target.value)
    }

    const handleLastChange = (e) => {
        setLast(e.target.value)
    }


    return (
        <form onSubmit={e => { handleSubmit(e) }}>
            <label>tokenURI:
                <input type="text" name="tokenURI" onChange={handleURIChange} />
            </label>
            <label>contract address:
                <input type="text" name="tokenURI" onChange={handleContractChange} />
            </label>
            <label>first id:
                <input type="text" name="tokenURI" onChange={handleFirstChange} />
            </label>
            <label>last id:
                <input type="text" name="tokenURI" onChange={handleLastChange} />
            </label>
            <input type="submit" value="Submit" />
        </form>
    )
}


export default MyForm