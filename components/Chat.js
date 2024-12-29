import styles from "../styles/chat.module.css";
import { useState, useEffect, useRef } from "react";

export default function Chat({value, submit, cancel}) {
    const [input, setInput] = useState("");
    const [textAreaValue, setTextAreaValue] = useState("");
    const roleReference = {"assistant": "Assistant", "user": "You", "system": "System", "warning": "Notice"};
    const textArea = useRef(null);
    useEffect(() => {
        setTextAreaValue(formatDialogue(value[value.length-1]));
    }, [value]);
    useEffect(() => {
        textArea.current.scrollTop = textArea.current.scrollHeight;
    }, [textAreaValue]);
    const submitHandler = () => {
        submit(input);
        setInput("");
    };
    const cancelHandler = () => {
        setInput("");
        cancel();
    }
    function formatDialogue(message) {
        return roleReference[message.role] + ": " + message.message + "\n";
    }
    return (
        <div className={styles.container}>
            <textarea ref={textArea} className={styles.chatlog} value={textAreaValue} rows={5} cols={30} readOnly></textarea>
            <div className={styles.form}>
                <input type={"text"} value={input} onInput={(evt) => {setInput(evt.target.value)}}></input>
                <button onClick={submitHandler}>{">"}</button>
                <button onClick={cancelHandler}>{"X"}</button>
            </div>
        </div>
    );
}