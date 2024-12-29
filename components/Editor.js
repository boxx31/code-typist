import styles from "../styles/editor.module.css";
import { useEffect, useRef } from "react";

const ghostComments = {
    "1": ['Select an exercise on the right menu'],
    "11": ['Type the characters. ENTER key = new line', 'Tip: TAB key = four spaces', 'Print "Hello, world!"', '', 'Press Run button when finished'],
    "12": ['', '', 'Declare a variable num1 with value 7', 'Declare a variable num2 with value -5.63', 
        'Declare a variable num3 equal to num1 + num2', 'Print the value of num3', '', ''],
    "13": ['', '', 'Declare score = 15', 'Declare condition = true', 'Check if score is at least 12 and condition is true', 
        'Print "Test passed!"', '', 'Print "Try again."', '', '', ''],
    "14": ['', '', 'For loop from 1 to 100, inclusive', 'Print the current counter', '', '', ''],
    "15": ['', '', 'Declare a long variable named num with value 1', 'Continue a loop as long as num < 2500', 'Print the current num value',
           'Double the value of num', '', '', ''],
    "16": ['', '', 'Make a String array using a literal', 'Initialize arr2, an integer array of length 3', 'Change first number of arr2', 
           'Change second number of arr2 to the length of arr1', 'Change second element of arr1 to "code typist"', 'Loop through each element of arr1', 
           'Print elements separated by a space character', '', 'Print elements of arr2', '', '']
};
const commentsLocation = {
    "1": 45,
    "11": 45,
    "12": 45,
    "13": 47,
    "14": 45,
    "15": 45,
    "16": 54,
};

export default function Editor({content, override, page, mode, hideGuide, ghostContent}) {
    const scrollPos = useRef();
    useEffect(() => {
        content.set(override.code);
    }, [override]);
    const handleInput = (event) => {
        if (content.set) {
            content.set(event.target.textContent);
        }
    };
    function generateGhostText(rawText) {
        if (ghostContent.program.length == 0) {
            return rawText;
        }
        var ghost = "";
        var ind1 = 0;
        var ind2 = 0;
        var lineNum = 0;
        if (rawText[rawText.length-1] == "\n") {                            // trim last newline (contenteditable adds additional newline)
            rawText = rawText.substring(0, rawText.length-1);
        }
        while (ind1 < rawText.length && ind2 < ghostContent.program.length) {       // use two pointers to generate ghost text
            if (rawText[ind1] == ghostContent.program[ind2]) {
                if (rawText[ind1] == "\n") {
                    lineNum++;
                }
                ghost += "<strong>" + rawText[ind1] + "</strong>";
                ind1++;
                ind2++;
            } else {
                if (rawText[ind1] == "\n") {
                    ghost += "\n";
                } else if (rawText[ind1].toUpperCase() == ghostContent.program[ind2].toUpperCase()) {
                    ghost += "<em>" + rawText[ind1] + "</em>";
                    ind2++;
                } else {
                    ghost += "<mark>" + rawText[ind1] + "</mark>";
                }
                ind1++;
            }
        }
        if (ind1 == rawText.length && ind2 < ghostContent.program.length) {
            var ghostExtra;
            if (mode == 1) {
                ghostExtra = ghostContent.style.substring(ind2).replaceAll("_", "\u2022");
            } else {
                ghostExtra = ghostContent.program.substring(ind2);
            }
            ghost += ghostExtra.split("\n").map((x, ind) => {
                if (ghostComments[page][ind+lineNum] == "" || hideGuide) {
                    return x;
                } else {
                    var preTrim = "";
                    if (rawText.lastIndexOf("\n") != -1 && ind == 0) {
                        preTrim = x.padEnd(commentsLocation[page]-(rawText.length-rawText.lastIndexOf("\n")-1)) + " <span>// " + ghostComments[page][ind+lineNum] + "</span>";
                    } else if (ind == 0) {
                        preTrim = x.padEnd(commentsLocation[page]-rawText.length) + " <span>// " + ghostComments[page][ind+lineNum] + "</span>";
                    } else {
                        preTrim = x.padEnd(commentsLocation[page]) + " <span>// " + ghostComments[page][ind+lineNum] + "</span>";
                    }
                    return preTrim;
                }
            }).join("\n");
        } else if (ind1 < rawText.length && ind2 == ghostContent.program.length) {
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
        if (mode == 1) {
            return;
        }
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
    function scrollHandler(evt) {
        scrollPos.current.scrollTop = evt.target.scrollTop;
    }
    return (
        <div className={styles.container}>
            <span contentEditable suppressContentEditableWarning={true} spellCheck="false" className={styles.ghost} ref={scrollPos} 
                dangerouslySetInnerHTML={{__html: generateGhostText(content.get)}}></span>
            <span contentEditable suppressContentEditableWarning={true} spellCheck="false" onKeyDown={keyHandler} onPaste={pasteHandler} onInput={handleInput} 
                onScroll={scrollHandler} key={override.key} className={styles.editor} dangerouslySetInnerHTML={{__html: override.code}}></span>
        </div>
    );
}