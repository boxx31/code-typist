import Editor from "../../components/Editor.js";
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
    const [code, setCode] = useState("Default text");
    const [status, setStatus] = useState("typing");
    const pageLinks = [
        {"key": 1, "text": "Exercise 1"},
        {"key": 2, "text": "Exercise 2"},
        {"key": 3, "text": "Exercise 3"}
    ];
    function runHandler() {
        alert(code);
    }
    function restartHandler() {
        if (confirm("Are you sure you want to restart?")) {
            setCode("");
            setStatus("typing");
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
                        <textarea rows={20} cols={100} placeholder={"Output goes here..."} readOnly></textarea>
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