import Editor from "../components/Editor.js";
import Selector from "../components/Selector.js";
import { useState, useEffect } from 'react';
import styles from "../styles/home.module.css";
import { runJavaCode, runChat } from "../services/api.js";
import { useRef } from 'react';
import { plexMono, tab, styleKeys, pageKeys, pageData, classNames, instructions, ghostPrograms, ghostStyle, expectedOutput } from "../indexConstants.js";

export default function Home() {
    const [code, setCode] = useState("");
    const [overrideCode, setOverrideCode] = useState({key: true, code: ""});
    const [output, setOutput] = useState("");
    const [page, setPage] = useState(1);
    const [mode, setMode] = useState(0);
    const [progress, setProgress] = useState(createPageData("not attempted"));
    const [timerValue, setTimerValue] = useState(0);
    const [recordTime, setRecordTime] = useState(createPageData("None"));
    const [showGuide, setShowGuide] = useState(true);
    // My records: Hello world - 15.5
    
    const timerActive = useRef(false);
    const savedCode = useRef(createPageData(""));
    const interval = useRef(null);

    useEffect(() => {
        /*
        Summary:
        When first character is entered: Change progress, start timer (challenge only)
        When last character is entered: Change progress, stop timer (challenge only)
        When page/mode is changed: Stop and reset timer if run (challenge only)
        When there are no characters: Change progress
        */
        if (code.length == 0) {
            var newProgress = {...progress};
            newProgress[page] = "not attempted";
            setProgress(newProgress);
        } else if (code == ghostPrograms[page]) {
            var newProgress = {...progress};
            newProgress[page] = "complete";
            setProgress(newProgress);

            if (timerActive.current) {
                if (recordTime[page] == "None" || recordTime[page] > timerValue) {
                    var newRecordTime = {...recordTime};
                    newRecordTime[page] = timerValue.toFixed(1);
                    setRecordTime(newRecordTime);
                }
                clearInterval(interval.current);
                timerActive.current = false;
                return;
            }
        } else {
            var newProgress = {...progress};
            newProgress[page] = "in progress";
            setProgress(newProgress);
            
            if (progress[page] == "not attempted") {
                if (mode == 1) {
                    interval.current = setInterval(runTimer, 100);
                    timerActive.current = true;
                    return;
                }
            }
        }
        clearInterval(interval.current);
        setTimerValue(0);
        timerActive.current = false;
    }, [page, mode, code.length == 0, code == ghostPrograms[page]]);

    function runTimer(){
        setTimerValue((x) => (x + 0.1));
    }
    function createPageData(item) {
        var result = {};
        for (const i of pageKeys) {
            if (typeof item === "object") {
                result[i] = {...item};
            } else {
                result[i] = item;
            }
        }
        return result;
    }
    async function runHandler() {
        var newSavedCode = {...savedCode.current};
        newSavedCode[page] = code;
        savedCode.current = newSavedCode;
        const output = await runJavaCode(classNames[page], code);
        setOutput(output.output + output.error);
        if (output.error === "" && output.output.includes(expectedOutput[page])) {
            var newProgress = {...progress};
            newProgress[page] = "complete";
            setProgress(newProgress);
        }
    }
    function restartHandler(requestMode) {
        if (confirm("Are you sure you want to restart?")) {
            var newCode = "";
            if (requestMode == 2) {
                newCode = "public class " + classNames[page] + ` {\n${tab}\n}`;
            }
            setOverrideCode({key: !overrideCode.key, code: newCode});
            setOutput("");
            var newProgress = {...progress};
            newProgress[page] = "not attempted";
            setProgress(newProgress);
            return true;
        }
        return false;
    }
    function changePage(key) {
        var newSavedCode = {...savedCode.current};
        newSavedCode[page] = code;
        savedCode.current = newSavedCode;

        setPage(key);
        setOverrideCode({key: !overrideCode.key, code: (savedCode.current)[key]});
    }
    function changeMode(modeKey) {
        if ((modeKey == 0 || modeKey == 1) && code != "") {
            if (!restartHandler(modeKey)) return;
        }
        if (modeKey == 2 && code.replaceAll("\n", "") == "") {
            setOverrideCode({key: !overrideCode.key, code: "public class " + classNames[page] + 
                ` {\n${tab}public static void main(String[] args) {\n${tab}${tab}\n${tab}}\n}`});
        }
        setMode(modeKey);
    }
    async function chatHandler() {
        var userResponse = prompt("Do you have any experience in java coding?");
        const chatOutput = await runChat(userResponse, page, mode, code, output);
        switch (chatOutput.level) {
            case "1":
            case "2":
            case "3":
                changeMode(parseInt(chatOutput.level)-1);
            default:
                changeMode(0);
        }
    }
    return (
        <div>
            <header>
                <h1>Code Typist</h1>
            </header>
            
            <main className={styles.page}>
                <div>
                    <section>
                        <p>{instructions[page]}</p>
                    </section>
                    <section className={[styles.workspace, plexMono.className].join(" ")}>
                        <Editor content={{"get": code, "set": setCode}} override={overrideCode} page={page} mode={mode} showGuide={showGuide}
                            ghostContent={(mode <= 1) ? {program: ghostPrograms[page], style: ghostStyle[page]} : {program: "", style: ""}} />
                        <textarea className={styles.output} rows={20} placeholder={"Output will appear here..."} readOnly value={output}></textarea>
                    </section>
                    <section className={styles.control_panel}>
                        <p>Toolbar</p>
                        <button onClick={runHandler}>Run</button>
                        <button onClick={() => restartHandler(mode)}>Restart</button>
                        <button onClick={chatHandler}>Open Chat</button>
                        <Selector selected={{"get": mode, "set": changeMode}} />
                        <div>
                            <input type={"checkbox"} defaultChecked={showGuide} onChange={() => (setShowGuide(!showGuide))}></input>
                            <label>Show guiding comments</label>
                        </div>
                        {(mode == 1) ? (<p>Current time: {timerValue.toFixed(1)} sec | Record time: {recordTime[page]}{(recordTime[page] == "None") ? "":"s"}</p>) : null}
                    </section>
                </div>
                <nav className={styles.sidebar}>
                    {pageData.map((a) => {
                        if (a.key%10 == 0) {
                            return (
                                <div>
                                    <button className={styles.nav_header}>{a.text}</button>
                                    {a.children.map((b) => (
                                        <button className={[styles.nav_button, styleKeys[progress[b.key]], (page == b.page) ? styles.current_button:""].join(" ")} 
                                            onClick={() => changePage(b.key)}>{b.text}</button>
                                    ))}
                                </div>
                            );
                        } else {
                            return (
                                <button className={[styles.nav_button, (page == a.page) ? styles.current_button:""].join(" ")} 
                                    onClick={() => changePage(a.key)}>{a.text}</button>
                            );
                        }
                    })}
                </nav>
            </main>
        </div>
    );
}