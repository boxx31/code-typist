import Editor from "../../components/Editor.js";
import Link from 'next/link';
import { useState } from 'react';
import styles from "../../styles/editor.module.css";

export default function Home() {
    const [code, setCode] = useState("Default text");
    const [status, setStatus] = useState("typing");
    const [output, setOutput] = useState("");
    const pageLinks = [
        {"key": 1, "text": "Exercise 1"},
        {"key": 2, "text": "Exercise 2"},
        {"key": 3, "text": "Exercise 3"}
    ];
    function runHandler() {
        if(code === "print(\"Hello World!\")") {
            setOutput("Hello World!\n");
        } else {
            setOutput("Error message\n");
        }
    }
    function restartHandler() {
        if (confirm("Are you sure you want to restart?")) {
            setCode("");
            setStatus("typing");
            setOutput("");
        }
    }
    return (
        <div>
            <header>
                <h1>App Title</h1>
            </header>
            
            <main>
                <div>
                    <section>
                        <p>Select an exercise to begin</p>
                    </section>
                    <section>
                        <Editor text={{"get": code, "set": setCode}} />
                        <textarea rows={20} cols={100} placeholder={"Output will appear here..."} readOnly value={output}></textarea>
                    </section>
                    <section>
                        <button onClick={runHandler}>Run</button>
                        <button onClick={restartHandler}>Restart</button>
                    </section>
                </div>
                <nav>
                    {pageLinks.map((a) => {
                        return <Link href={"/exercise"+a.key}>{a.text}</Link>
                    })}
                </nav>
            </main>
        </div>
    );
}