"use client";

import React, {useState, useEffect} from "react";
import "./styles.css";
import {dragUpload, uploadCSV} from "@/lib/fileHandler/fileUpload";
import DataTable from "@/components/DataTable";
import CSVUploader from "@/components/fileUploadElements/CSVUploader";
import {deleteCsv} from "@/lib/sessionHandling/sessionUpdater";

function Data() {
    const [message, setMessage] = useState("");
    const [rowsNr, setRowsNr] = useState<number | null>(null);
    const [columnsNr, setColumnsNr] = useState<number | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [missed, setMissed] = useState<number>();
    const [result, setResult] = useState<any>(null);

    function handleNewData() {
        const data = sessionStorage.getItem("csvData");
        if (!data || data.length < 4) return;
        const _result = JSON.parse(data);

        setRowsNr(_result.summary.rows);
        setColumnsNr(_result.summary.columns);
        setFileName(_result.summary.filename);
        setResult(_result);
        let missing = 0;
        for (let key in _result.summary.missingValues) {
            missing += _result.summary.missingValues[key];
        }
        setMissed(missing);
    }

    async function clearData() {
        const curSesId = sessionStorage.getItem("currentSessionId");
        if (!curSesId) return;
        await deleteCsv(parseInt(curSesId));

        setResult(null);
        sessionStorage.removeItem("csvData");
    }


    useEffect(() => {
        handleNewData();
    }, [])

    return (
        <div className="pageData">
            <div className={"flex gap-[0.1rem] w-full"}>
                <div className={"flex flex-col w-[50%] gap-[0.1rem]"}>
                    <div className="area w-full gap-[1rem]">
                        <h3 className={"subtitle"}>Dataset Overview</h3>
                        <div className="dataSum">
                            <div className="info">
                                <h1>File</h1>
                                <h2>{result == null ? "No file uploaded" : fileName}</h2>
                            </div>
                            <div className="info">
                                <h1>Rows</h1>
                                <h2>{result == null ? "-" : rowsNr}</h2>
                            </div>
                            <div className="info">
                                <h1>Columns</h1>
                                <h2>{result == null ? "-" : columnsNr}</h2>
                            </div>
                            <div className="info">
                                <h1>Missing values</h1>
                                <h2>{result == null ? "-" : missed}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="area">
                        <div className={"dataArea w-full"}>
                            <CSVUploader callBack={handleNewData}/>
                            <button className={"deleteButton"} onClick={clearData}>
                                Clear Data <i className="fa-solid fa-trash-xmark"></i>
                            </button>

                        </div>
                    </div>
                </div>
                <div className={"area w-[50%] h-full"}>
                    <h2 className={"subtitle"}>Analytical data tools</h2>
                    <p>Coming soon</p>
                </div>
            </div>

            <div className="area tableArea">
                <DataTable result={result}/>
            </div>

        </div>
    );
}

export default Data;
