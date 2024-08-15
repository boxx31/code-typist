import { useState , useRef } from 'react';
import styles from "../../styles/editor.module.css";
import parse from "html-react-parser";
import { IBM_Plex_Mono } from "next/font/google";

const plexMono = IBM_Plex_Mono({
    weight: "400",
    style: ["normal", "italic"],
    subsets: ["latin"]
});

export default function Home({pageProps}) {
    const [code, setCode] = useState("Def");
    return (
        <Component {...pageProps} content={{"get": code, "set": setCode}} ghostContent={"Default text\nNew line"} />
    );
}

function Component({content, ghostContent}) {
    const defaultValue = useRef(content.get);
    const handleInput = (event) => {
        if (content.set) {
            content.set(event.target.textContent);
        }
    };
    function generateGhostText(rawText) {
        var ghost = "";
        var ind1 = 0;
        var ind2 = 0;
        if (rawText[rawText.length-1] == "\n") {                            // trim last newline (contenteditable adds additional newline)
            rawText = rawText.substring(0, rawText.length-1);
        }
        while (ind1 < rawText.length && ind2 < ghostContent.length) {       // use two pointers to generate ghost text
            if (rawText[ind1] == ghostContent[ind2]) {
                ghost += rawText[ind1];
                ind1++;
                ind2++;
            } else {
                if (rawText[ind1] == "\n") {
                    ghost += rawText[ind1];
                } else {
                    ghost += "<mark>" + rawText[ind1] + "</mark>";
                }
                ind1++;
            }
        }
        if (ind1 == rawText.length && ind2 < ghostContent.length) {
            ghost += ghostContent.substring(ind2);
        } else if (ind1 < rawText.length && ind2 == ghostContent.length) {
            for (var i = ind1; i < rawText.length; i++) {
                if (rawText[i] == "\n") {
                    ghost += rawText[i];
                } else {
                    ghost += "<mark>" + rawText[i] + "</mark>";
                }
            }
        }
        return ghost;
    }
    function keyHandler(evt) {
        if (evt.key == "Tab") {                                             // manually simulate tab press = 4 spaces
            evt.preventDefault();
            var doc = evt.currentTarget.ownerDocument.defaultView;
            var sel = doc.getSelection();
            var range = sel.getRangeAt(0);

            var tabNode = document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
            range.insertNode(tabNode);

            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode); 
            sel.removeAllRanges();
            sel.addRange(range);
            handleInput(evt);
        }
    }
    return (
        <div className={[styles.container, plexMono.className].join(" ")}>
            <span contentEditable suppressContentEditableWarning={true} spellcheck="false" className={styles.ghost}>{parse(generateGhostText(content.get))}</span>
            <span contentEditable suppressContentEditableWarning={true} spellcheck="false" onKeyDown={keyHandler} onInput={handleInput} className={styles.editor} dangerouslySetInnerHTML={{ __html: defaultValue.current }}></span>
        </div>
    );
}