import styles from "../styles/editor.module.css";
import { useEffect } from "react";

export default function Editor({content, override, ghostContent}) {
    useEffect(() => {
        content.set(override.code);
    }, [override]);
    const handleInput = (event) => {
        if (content.set) {
            content.set(event.target.textContent);
        }
        console.log("Current text content: " + content.get);
    };
    function generateGhostText(rawText) {
        if (ghostContent.length == 0) {
            return rawText;
        }
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

            var tabNode = document.createTextNode("    ");
            range.insertNode(tabNode);

            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode); 
            sel.removeAllRanges();
            sel.addRange(range);
            handleInput(evt);
        }
    }
    function pasteHandler(evt) {
        evt.preventDefault();
        var text = evt.clipboardData.getData('text/plain').replaceAll("\r", "");
        var doc = evt.currentTarget.ownerDocument.defaultView;
        var sel = doc.getSelection();
        var range = sel.getRangeAt(0);

        var textNode = document.createTextNode(text);
        range.insertNode(textNode);

        range.setStartAfter(textNode);
        range.setEndAfter(textNode); 
        sel.removeAllRanges();
        sel.addRange(range);
        handleInput(evt);
    }
    return (
        <div className={styles.container}>
            <span contentEditable suppressContentEditableWarning={true} spellcheck="false" className={styles.ghost} 
                dangerouslySetInnerHTML={{__html: generateGhostText(content.get)}}></span>
            <span contentEditable suppressContentEditableWarning={true} spellcheck="false" onKeyDown={keyHandler} onPaste={pasteHandler} onInput={handleInput} 
                key={override.key} className={styles.editor} dangerouslySetInnerHTML={{__html: override.code}}></span>
        </div>
    );
}