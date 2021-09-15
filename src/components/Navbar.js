import styled from "styled-components"
import { Link } from "react-router-dom";
import { useReducer } from "react";
import { useHistory } from 'react-router'


const NavButton = styled.button`
    background-color: #00D688;
    padding:8px 17px;
    border: none;
    color: #1A4D8E;
    text-decoration: none;
    margin: 4px 2px;
    cursor: pointer;
    border-radius:30px;
    height:40px;
    width:180px;

`

function Navbar() {

    const history = useHistory()

    const [lastResetAt, reset] = useReducer(() => +new Date(), 0)

    const linkTarget = {
        pathname: "/collection_x",
        key: lastResetAt,
        state: {
            applied: true
        }
    };

    function handleHome() {

    }

    function handleScan() {
        reset();
    }
    return (
        <>
            <Link to="/">
                <NavButton onClick={handleHome}>Home</NavButton>
            </Link>
            <Link to={linkTarget}>
                <NavButton onClick={handleScan}>Scan Collection</NavButton>
            </Link>
        </>
    )
}

export default Navbar;