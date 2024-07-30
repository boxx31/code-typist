import Editor from "../components/Editor.js";
import Selector from "../components/Selector.js";
import Link from 'next/link';
import { useState } from 'react';
import { IBM_Plex_Mono } from "next/font/google";
import styles from "../styles/home.module.css";
import { runJavaCode } from "../services/api.js";
import OpenAI from "openai";

const plexMono = IBM_Plex_Mono({
    weight: "400",
    style: ["normal", "italic"],
    subsets: ["latin"]
});
//const openai = new OpenAI();

export default function Home() {
    const [code, setCode] = useState("Default text");
    const [status, setStatus] = useState("typing");
    const [output, setOutput] = useState("");
    const [progress, setProgress] = useState(["not attempted"]);
    const pageLinks = [
        {"key": 1, "text": "Exercise 1"},
        {"key": 2, "text": "Exercise 2"},
        {"key": 3, "text": "Exercise 3"}
    ];
    async function runHandler() {
        const output = await runJavaCode("Program", code);
        setOutput(output.output + "\n" + output.error);

        /*if(code === "print(\"Hello World!\")") {
            setOutput("Hello World!\n");
        } else {
            setOutput("Error message\n");
        }*/
    }
    function restartHandler() {
        if (confirm("Are you sure you want to restart?")) {
            setCode("");
            setStatus("typing");
            setOutput("");
        }
    }
    function modeHandler() {

    }
    async function chatHandler() {
        
    }
    return (
        <div>
            <header>
                <h1>App Title</h1>
            </header>
            
            <main className={styles.page}>
                <div>
                    <section>
                        <p>Select an exercise to begin</p>
                    </section>
                    <section className={plexMono.className}>
                        <Editor text={{"get": code, "set": setCode}} />
                        <textarea rows={20} cols={100} placeholder={"Output will appear here..."} readOnly value={output}></textarea>
                    </section>
                    <section className={styles.control_panel}>
                        <button onClick={runHandler}>Run</button>
                        <button onClick={restartHandler}>Restart</button>
                        <button onClick={chatHandler}>Open Chat</button>
                        <Selector onClick={modeHandler} />
                    </section>
                    <section>
                        <p>Challenges:</p>
                        <ul>
                            <li>No guide text</li>
                            <li>Edit the program</li>
                            <li>Time challenge</li>
                        </ul>
                    </section>
                </div>
                <nav className={styles.sidebar}>
                    {pageLinks.map((a) => {
                        return <Link href={"/exercise"+a.key}>{a.text}</Link>
                    })}
                </nav>
            </main>
        </div>
    );
}