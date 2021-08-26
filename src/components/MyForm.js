import { useHistory } from "react-router-dom";
import { useState } from "react"

function MyForm() {

    let history = useHistory();
    const [URI, setURI] = useState('')
    const [CONTRACT, setCONTRACT] = useState('')
    const [collectionSize, setCollectionSize] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        history.push(`/${URI}/${CONTRACT}/${collectionSize}`)
    }

    const handleURIChange = (e) => {
        setURI(e.target.value)
    }

    const handleContractChange = (e) => {
        setCONTRACT(e.target.value)
    }

    const handleCollectionSizeChange = (e) => {
        setCollectionSize(e.target.value)
    }


    return (
        <form onSubmit={e => { handleSubmit(e) }}>
            <label>tokenURI:
                <input type="text" name="tokenURI" onChange={handleURIChange} />
            </label>
            <label>contract address:
                <input type="text" name="tokenURI" onChange={handleContractChange} />
            </label>
            <label>collection size:
                <input type="text" name="tokenURI" onChange={handleCollectionSizeChange} />
            </label>
            <input type="submit" value="Submit" />
        </form>
    )
}


export default MyForm