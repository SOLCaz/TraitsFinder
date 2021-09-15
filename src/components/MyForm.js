import { useHistory } from "react-router-dom";
import { useState } from "react"
import { Link } from "react-router-dom";
import styled from "styled-components";
import { css } from "styled-components"

import '../styles/form.css'

const Form = styled.form`
  display: grid;
  padding: 1em;
  background: transparent;
  border: 1px solid #c1c1c1;
  margin: 2rem auto 0 auto;
  max-width: 600px;
  padding: 1em;
`

const LabelStyle = styled.span`
    color:#73737A;
`
const CheckboxStyle = styled.input`
    display: inline-flex;
    cursor: pointer;
    position: relative;
`
const FormInput = styled.input`
    margin-right:25px;
    background-color:transparent;
    border: none;
    border-bottom: 1px solid #00B663;
    text-align:center;
    color:white;
`

const SubmitStyle = styled.input`
    background-color: #00D688;
    padding:8px 17px;
    border: none;
    color: #1A4D8E;
    text-decoration: none;
    margin: 4px 2px;
    cursor: pointer;
    border-radius:30px;
    height:40px;
    width:120px;

`

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
        setSubmit(false)
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

            <label for="collection-data-url">Collection data URL</label>
            <input type="text" name="collection-data-url" onChange={handleURIChange} />

            <label for="checkBox"> metadata hosted on IPFS ?</label>
            <input type="checkbox" onChange={handleToggle} name="checkBox" />

            <label for="contract">Contract</label>
            <input type="text" name="contract" onChange={handleContractChange} />

            <label for="first">First collection ID</label>

            <input type="text" name="first" onChange={handleFirstChange} />

            <label for="last">Last Collection ID</label>

            <input type="text" name="last" onChange={handleLastChange} />
            <SubmitStyle type="submit" value="Submit" />

        </form>

    )
}


export default MyForm