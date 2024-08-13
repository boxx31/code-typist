import Editor from "../components/Editor.js";
import Selector from "../components/Selector.js";
import { useState } from 'react';
import { IBM_Plex_Mono } from "next/font/google";
import styles from "../styles/home.module.css";
import { runJavaCode } from "../services/api.js";
import { useRef } from 'react';

const plexMono = IBM_Plex_Mono({
    weight: "400",
    style: ["normal", "italic"],
    subsets: ["latin"]
});
const tab = "    ";
const styleKeys = {
    "not attempted": styles.not_attempted_button,
    "in progress": styles.in_progress_button,
    "complete": styles.complete_button
};

export default function Home() {
    const pageKeys = [0, 1, 11, 12, 13, 14, 21, 22];
    const [code, setCode] = useState("");
    const [overrideCode, setOverrideCode] = useState({key: true, code: ""});
    const [output, setOutput] = useState("");
    const [page, setPage] = useState(1);
    const [mode, setMode] = useState(0);
    const [progress, setProgress] = useState(createPageData("not attempted"));

    const savedCode = useRef(createPageData(""));

    const pageData = [
        {key: 1, text: "Free mode"},
        {key: 10, text: "Tutorials", children: [
            {key: 11, text: "Hello World"},
            {key: 12, text: "Variables"},
            {key: 13, text: "If-else"},
            {key: 14, text: "For loop"},
        ]},
        {key: 20, text: "Challenges", children: [
            {key: 21, text: "Challenge 1"},
            {key: 22, text: "Challenge 2"}
        ]},
    ];
    const classNames = {
        "1": `Program`,
        "11": `HelloWorld`,
        "12": `Variables`,
        "13": `IfElse`,
        "14": `ForLoop`,
    }
    const instructions = {
        "1": 'Select an exercise to begin.',
        "11": 'Write a program that prints "Hello, world!" to the terminal.',
        "12": 'Declare two variables num1 and num2 with values 7 and -5.63. Declare a third variable num3 equal to the sum of num1 and num2, then print the value of num3.',
        "13": 'Declare two variables score and condition with values 15 and true. Use an if-else statement to print "Test passed!" if the score is greater than or equal to 12 and condition is true. Print "Try again." otherwise',
        "14": 'Write a program that prints the whole numbers from 1 to 100 using a for loop. Each number should be printed on a new line.'
    };
    const ghostPrograms = {
        "1": ``,
        "11": `public class HelloWorld {\n${tab}public static void main(String[] args) ` + 
            [`{`, `System.out.println("Hello, World!");`].join(`\n${tab}${tab}`)
            + `\n${tab}}\n}`,
        "12": `public class Variables {\n${tab}public static void main(String[] args) ` + 
            [`{`, `int num1 = 7;`, `double num2 = -5.63;`, `double num3 = num1 + num2;`, `System.out.println(num3);`].join(`\n${tab}${tab}`)
            + `\n${tab}}\n}`,
        "13": `public class IfElse {\n${tab}public static void main(String[] args) ` + 
            [`{`, `int score = 15;`, `boolean condition = true;`, `if (score >= 12 && condition) {`, `${tab}System.out.println("Test passed!");`,
            `} else {`, `${tab}System.out.println("Try again.");`, `}`].join(`\n${tab}${tab}`)
            + `\n${tab}}\n}`,
        "14": `public class ForLoop {\n${tab}public static void main(String[] args) ` + 
            [`{`, `for (int i = 1; i <= 100; i++) {`, `${tab}System.out.println(i);`, `}`].join(`\n${tab}${tab}`)
            + `\n${tab}}\n}`,
    };
    const expectedOutput = {
        "1": ``,
        "11": `Hello, world!`,
        "12": `1.37`,
        "13": `Test passed!`,
        "14": [...Array(100).keys()].map(x => (x++)).join("\n"),
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
    function standardizeFormat(programStr) { // replaces non-breaking spaces with normal spaces
        return programStr.replace(/\s/g, " ");
    }
    async function runHandler() {
        var newSavedCode = {...savedCode.current};
        newSavedCode[page] = code;
        savedCode.current = newSavedCode;
        const output = await runJavaCode(classNames[page], standardizeFormat(code));
        setOutput(output.output + output.error);
        if (output.error === "" && output.output.includes(expectedOutput[page])) {
            setProgress({...progress, page: "complete"});
        }
    }
    function restartHandler() {
        if (confirm("Are you sure you want to restart?")) {
            var newCode = "";
            if (mode == 2) {
                newCode = "public class " + classNames[page] + " {\n\n}";
            }
            setOverrideCode({key: !overrideCode.key, code: newCode});
            setOutput("");
            setProgress({...progress, page: "not attempted"});
        }
    }
    function changePage(key) {
        var newSavedCode = {...savedCode.current};
        newSavedCode[page] = code;
        savedCode.current = newSavedCode;

        setPage(key);
        var newProgress = {...progress};
        newProgress[key] = "in progress";
        setProgress(newProgress);
        setOverrideCode({key: !overrideCode.key, code: (savedCode.current)[key]});
    }
    function changeMode(modeKey) {
        setMode(modeKey);
        if (modeKey === 2 && code.replaceAll("\n", "") === "") {
            setOverrideCode({key: !overrideCode.key, code: "public class " + classNames[page] + " {\n\n}"});
        }
    }
    async function chatHandler() {
        
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
                        <Editor content={{"get": code, "set": setCode}} override={overrideCode} ghostContent={(mode <= 1) ? ghostPrograms[page] : ""} />
                        <textarea rows={20} cols={100} placeholder={"Output will appear here..."} readOnly value={output}></textarea>
                    </section>
                    <section className={styles.control_panel}>
                        <button onClick={runHandler}>Run</button>
                        <button onClick={restartHandler}>Restart</button>
                        <button onClick={chatHandler}>Open Chat</button>
                        <Selector onChange={changeMode} />
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