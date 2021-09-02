import styled from "styled-components"
import { Link } from "react-router-dom";

const HomeButton = styled.button`
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

function Navbar(){

    function handleHome(){
        
    }

    function handleScan(){

    }
    return(
        <>
        <Link to="/">
            <HomeButton onClick={handleHome}>Home</HomeButton> 
        </Link>
        <Link to="/scan">
            <HomeButton onClick={handleScan}>Scan Collection</HomeButton>
        </Link>
       </>
    )
}

export default Navbar;