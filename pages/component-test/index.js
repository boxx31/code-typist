import { useState } from 'react';
import styles from "../../styles/editor.module.css";
import parse from "html-react-parser";
import { IBM_Plex_Mono } from "next/font/google";

const plexMono = IBM_Plex_Mono({
    weight: "400",
    style: ["normal", "italic"],
    subsets: ["latin"]
});

export default function Home({pageProps}) {
    const [code, setCode] = useState("Default text");
    return (
        <Component {...pageProps} text={{"get": code, "set": setCode}} />
    );
}

function generateGhostText(typed, solution) {
    var ghost = "";
    var ind1 = 0;
    var ind2 = 0;
    console.log(typed);
    while (ind1 < typed.length && ind2 < solution.length) {
        if (typed[ind1] == solution[ind2]) {
            ghost += typed[ind1];
            ind1++;
            ind2++;
        } else {
            ghost += "<mark>" + typed[ind1] + "</mark>";
            ind1++;
        }
    }
    if (ind1 == typed.length && ind2 < solution.length) {
        ghost += solution.substring(ind2);
    } else if (ind1 < typed.length && ind2 == solution.length) {
        ghost += "<mark>" + typed.substring(ind2) + "</mark>";
    }
    console.log(ghost);
    return ghost;
}

function Component({text}) {
    function cursor_position() {
        var sel = document.getSelection();
        sel.modify("extend", "backward", "paragraphboundary");
        var pos = sel.toString().length;
        if(sel.anchorNode != undefined) sel.collapseToEnd();
        return pos;
    }
    function keyHandler(evt) {
        switch (evt.keyCode) {
            case 9:
                evt.preventDefault();
                console.log(evt.currentTarget.innerHTML);
                console.log(cursor_position());
                evt.currentTarget.innerHTML += "\t";
                text.set(evt.currentTarget.innerHTML);
            break;
            case 13:
                evt.preventDefault();
                evt.currentTarget.innerHTML += "\n";
                text.set(evt.currentTarget.innerHTML);
                evt.currentTarget.focus();
            break;
        }
    }
    return (
        <div className={[styles.container, plexMono.className].join(" ")}>
            <div contentEditable={true} suppressContentEditableWarning={true} className={styles.ghost}>{parse(generateGhostText(text.get, "Default text\nNew line"))}</div>
            <div contentEditable={true} defaultValue={parse(text.get)} onKeyDown={keyHandler} onInput={(e) => {text.set(e.currentTarget.innerHTML)}} className={styles.editor}></div>
            <pre></pre>
        </div>
    );
}