import React, { useCallback, useEffect, useState } from "react";
import IPFS from "ipfs";
import { createPortal } from 'react-dom';
import MyForm from '../components/MyForm';
import { useParams } from "react-router-dom";

function Home() {




    return (
        <div className="App">
            <MyForm></MyForm>
        </div>
    );
}

export default Home;
