import Editor from "../components/Editor.js";
import Selector from "../components/Selector.js";
import Chat from "../components/Chat.js";
import { useState, useEffect } from 'react';
import styles from "../styles/home.module.css";
import { runJavaCode, runChat } from "../services/api.js";
import { useRef } from 'react';
import { plexMono, tab, styleKeys, pageKeys, pageData, classNames, ghostPrograms, ghostStyle, expectedOutput } from "../indexConstants.js";

export default function Home() {
    const [code, setCode] = useState("");
    const [overrideCode, setOverrideCode] = useState({key: true, code: ""});
    const [output, setOutput] = useState("");
    const [page, setPage] = useState(11);
    const [mode, setMode] = useState(0);
    const [progress, setProgress] = useState(createPageData("not attempted"));
    const [timerValue, setTimerValue] = useState(0);
    const [recordTime, setRecordTime] = useState(createPageData("None"));
    const [hideGuide, setHideGuide] = useState(false);
    const [chatMessages, setChatMessages] = useState([{"role": "assistant", "message": "Welcome. Feel free to ask for tips and tutorials."}]);
    // My records: Hello world - 15.5
    
    const timerActive = useRef(false);
    const savedCode = useRef(createPageData(""));
    const interval = useRef(null);
    const systemPrompt = useRef("");

    const sessionKey = Date.now().toString(36) + Math.random().toString(36).slice(2);

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
        setChatMessages([...chatMessages, {"role": "system", "message": "Program run."}]);
        const receivedData = await runJavaCode(sessionKey, classNames[page], code);
        setOutput(receivedData.output + receivedData.error);
        if (receivedData.error === "" && receivedData.output.includes(expectedOutput[page])) {
            var newProgress = {...progress};
            newProgress[page] = "complete";
            setProgress(newProgress);
        }
    }
    function restartPre() {
        setChatMessages([...chatMessages, {"role": "warning", "message": "Press '>' to confirm restart."}]);
        systemPrompt.current = "/restart";
    }
    function restartHandler(requestMode) {
        var newCode = "";
        if (requestMode == 2) {
            newCode = "public class " + classNames[page] + 
                ` {\n${tab}public static void main(String[] args) {\n${tab}${tab}\n${tab}}\n}`;
        }
        setOverrideCode({key: !overrideCode.key, code: newCode});
        setOutput("");
        var newProgress = {...progress};
        newProgress[page] = "not attempted";
        setProgress(newProgress);
    }
    function changePage(key) {
        var newSavedCode = {...savedCode.current};
        newSavedCode[page] = code;
        savedCode.current = newSavedCode;

        setPage(key);
        if (key == 1 && savedCode.current[1] == "") {
            setOverrideCode({key: !overrideCode.key, code: code})
        } else {
            setOverrideCode({key: !overrideCode.key, code: (savedCode.current)[key]});
        }
    }
    function changeModePre(modeKey) {
        if (modeKey != 1 || code == "") {
            changeMode(modeKey);
        } else {
            restartPre();
            systemPrompt.current = "/mode " + modeKey;
        }
    }
    function changeMode(modeKey) {
        if (modeKey == 0 || modeKey == 1) {
            restartHandler(modeKey);
        }
        if (modeKey == 2 && code.replaceAll("\n", "") == "") {
            setOverrideCode({key: !overrideCode.key, code: "public class " + classNames[page] + 
                ` {\n${tab}public static void main(String[] args) {\n${tab}${tab}\n${tab}}\n}`});
        }
        setMode(modeKey);
    }
    async function chatSubmitHandler(request) {
        if (request.charAt(0) == "/") {
            runCommand(request);
            return;
        }
        if (systemPrompt.current == "/restart") {
            setChatMessages([...chatMessages, {"role": "system", "message": "Exercise restart."}]);
            runCommand("/restart");
            systemPrompt.current = "";
        } else if (systemPrompt.current.startsWith("/mode")) {
            setChatMessages([...chatMessages, {"role": "system", "message": "Changed mode successfully."}]);
            runCommand(systemPrompt.current);
            systemPrompt.current = "";
        } else if (systemPrompt.current == "") {
            setChatMessages([...chatMessages, {"role": "user", "message": request}]);
            const receivedData = await runChat(request, page, mode, code, output);
            if (receivedData.accepted) {
                setChatMessages([...chatMessages, {"role": "assistant", "message": receivedData.message}]);
                receivedData.commands.forEach(c => runCommand(c));
            } else {
                setChatMessages([...chatMessages, {"role": "system", "message": receivedData.message}]);
            }
        }
    }
    function chatCancelHandler() {
        if (systemPrompt.current.startsWith("/restart")) {
            setChatMessages([...chatMessages, {"role": "system", "message": "Restart canceled"}]);
        }
        systemPrompt.current = "";
    }
    function runCommand(command) {
        var args = command.split(" ");
        switch (args[0]) {
            case "/mode":
                changeMode(parseInt(args[1]));
                break;
            case "/page":
                changePage(parseInt(args[1]));
                break;
            case "/restart":
                restartHandler(mode);
                break;
            case "/run":
                runHandler();
                break;
        }
        
    }
    return (
        <div>
            <header>
                <h1>Code Typist</h1>
            </header>
            
            <main className={styles.page}>
                <nav className={styles.sidebar}>
                    {pageData.map((a) => {
                        if (a.key%10 == 0) {
                            return (
                                <div>
                                    <button className={styles.nav_header}>{a.text}</button>
                                    {a.children.map((b) => (
                                        <button className={[styles.nav_button, styleKeys[progress[b.key]], (page == b.key) ? styles.current_button:""].join(" ")} 
                                            onClick={() => changePage(b.key)}>{b.text}</button>
                                    ))}
                                </div>
                            );
                        } else {
                            return (
                                <button className={[styles.nav_button, styleKeys[progress[a.key]], (page == a.key) ? styles.current_button:""].join(" ")} 
                                    onClick={() => changePage(a.key)}>{a.text}</button>
                            );
                        }
                    })}
                </nav>
                <div className={styles.content}>
                    <section className={[styles.workspace, plexMono.className].join(" ")}>
                        <div>
                        <Editor content={{"get": code, "set": setCode}} override={overrideCode} page={page} mode={mode} hideGuide={hideGuide}
                            ghostContent={(mode <= 1) ? {program: ghostPrograms[page], style: ghostStyle[page]} : {program: "", style: ""}} />
                        </div>
                        <div>
                            <textarea className={styles.output} value={output} rows={15} placeholder={"Output will appear here..."} readOnly></textarea>
                            <Chat value={chatMessages} submit={chatSubmitHandler} cancel={chatCancelHandler}></Chat>
                        </div>
                    </section>
                    <section className={styles.toolbar}>
                        <p className={styles.toolbar_title}>Toolbar</p>
                        <button onClick={runHandler}>Run</button>
                        <button onClick={restartPre}>Reset</button>
                        <p>Mode:</p>
                        <Selector selected={{"get": mode, "set": changeModePre}} />
                        {(mode == 1) ? (<p>| Current time: {timerValue.toFixed(1)} sec | Record time: {recordTime[page]}{(recordTime[page] == "None") ? "":"s"} |</p>) : null}
                        <div>
                            <input type={"checkbox"} defaultChecked={hideGuide} onChange={() => (setHideGuide(!hideGuide))}></input>
                            <label>Hide comments</label>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}