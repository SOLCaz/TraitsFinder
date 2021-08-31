import { useHistory } from "react-router-dom";
import { useState } from "react"

import styled from "styled-components";
import { css } from "styled-components"



const FormWrapper = styled.div`
    border-bottom:solid #4B4B4B;
    border-width:3px;
    height:100px;
    display:flex;
    width:100%;
    justify-content:center;
    align-items:center;
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
    height:30px;
    width:120px;
    text-align: center;
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
        <FormWrapper>

            <form onSubmit={e => { handleSubmit(e) }}>

                <label>
                    <FormInput placeholder="metadata URL" type="text" name="apiURL" onChange={handleURIChange} />
                </label>
                <LabelStyle> metadata hosted on IPFS ?</LabelStyle>
                <CheckboxStyle type="checkbox" onChange={handleToggle} name="checkBox" />
                <label>
                    <FormInput type="text" placeholder="contract" name="contract" onChange={handleContractChange} />
                </label>
                <label>
                    <FormInput type="text" placeholder='first id' name="first" onChange={handleFirstChange} />
                </label>
                <label>
                    <FormInput type="text" placeholder='last id' name="last" onChange={handleLastChange} />
                </label>
                <SubmitStyle type="submit" value="Submit" />

            </form>
        </FormWrapper>

    )
}


export default MyForm