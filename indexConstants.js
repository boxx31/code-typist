// used in index.js

import { IBM_Plex_Mono } from "next/font/google";
import styles from "./styles/home.module.css";

export const plexMono = IBM_Plex_Mono({
    weight: ["300", "400"],
    style: ["normal", "italic"],
    subsets: ["latin"]
});
export const tab = "    ";
export const styleKeys = {
    "not attempted": styles.not_attempted_button,
    "in progress": styles.in_progress_button,
    "complete": styles.complete_button
};
export const pageKeys = [0, 1, 11, 12, 13, 14, 15, 16, 21, 22];
export const pageData = [
    {key: 1, text: "Free edit"},
    {key: 10, text: "Basic exercises", children: [
        {key: 11, text: "Hello World"},
        {key: 12, text: "Variables"},
        {key: 13, text: "If-else"},
        {key: 14, text: "For loop"},
        {key: 15, text: "While loop"},
        {key: 16, text: "Arrays"}
    ]}
]; // when adding new pages, be sure to adjust the AI as well
export const classNames = {
    "1": `Program`,
    "11": `HelloWorld`,
    "12": `Variables`,
    "13": `IfElse`,
    "14": `ForLoop`,
    "15": `WhileLoop`,
    "16": `Arrays`,
    "17": `Operations`,
    "21": `Methods`,
    "22": `Classes`
}
export const ghostPrograms = {
    "1": ``,
    "11": `public class HelloWorld {\n${tab}public static void main(String[] args) ` + 
        [`{`, `System.out.println("Hello, world!");`].join(`\n${tab}${tab}`)
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
    "15": `public class WhileLoop {\n${tab}public static void main(String[] args) ` + 
        [`{`, `long num = 1;`, `while (num < 2500) {`, `${tab}System.out.println(num);`, `${tab}num = num * 2;`, `}`].join(`\n${tab}${tab}`)
        + `\n${tab}}\n}`,
    "16": `public class Arrays {\n${tab}public static void main(String[] args) ` + 
        [`{`, `String[] arr1 = {"java", "arrays", "code", "exercise"};`, `int[] arr2 = new int[3];`, `arr2[0] = 31;`, `arr2[1] = arr1.length;`,
         `arr1[1] = arr[2] + " typist";`, `for (String element : arr1) {`, `${tab}System.out.println(element + " ");`, `}`, `System.out.println(arr2[0], arr2[1], arr2[2]);`
        ].join(`\n${tab}${tab}`)
        + `\n${tab}}\n}`,
    "17": `public class Operations {\n${tab}public static void main(String[] args) ` + 
        [`{`, `for (int i = 1; i <= 100; i++) {`, `${tab}System.out.println(i);`, `}`].join(`\n${tab}${tab}`)
        + `\n${tab}}\n}`,
};
export const ghostStyle = {
    "1": ``,
    "11": `public class HelloWorld {\n${tab}p_____ s_____ v___ main(______[] args) ` + 
        [`{`, `S_____.o__.println("_____________");`].join(`\n${tab}${tab}`)
        + `\n${tab}}\n}`,
    "12": `p_____ c____ Variables {\n${tab}p_____ s_____ v___ m___(______[] args) ` + 
        [`{`, `___ num1 = 7;`, `______ num2 = -5.63;`, `______ ___3 = num1 + num2;`, `______.___.println(num3);`].join(`\n${tab}${tab}`)
        + `\n${tab}}\n}`,
    "13": `public _____ IfElse {\n${tab}______ ______ ____ main(S_______ args) ` + 
        [`{`, `___ score = 15;`, `_______ condition = true;`, `if (_____ >= 12 && c________) {`, `${tab}System.out._____ln("Test passed!");`,
        `} ____ {`, `${tab}System.___._____ln("Try again.");`, `}`].join(`\n${tab}${tab}`)
        + `\n${tab}}\n}`,
    "14": `______ class ForLoop {\n${tab}______ ______ ____ main(______[] args) ` + 
        [`{`, `for (___ i = 1; i __ 100; i++) {`, `${tab}S_____.___.println(i);`, `}`].join(`\n${tab}${tab}`)
        + `\n${tab}}\n}`,
    "15": `______ c____ WhileLoop {\n${tab}______ ______ v___ main(________ args) ` + 
        [`{`, `____ ___ = _;`, `w____ (___ _ ____) _`, `${tab}S_____.___.p____ln(___);`, `${tab}___ = ___ * _;`, `_`].join(`\n${tab}${tab}`)
        + `\n${tab}_\n_`,
    "16": `______ c____ Arrays {\n${tab}______ ______ ____ ____(S_____[] args) ` + 
        [`{`, `S_______ arr1 = {"java", "arrays", "code", "exercise"};`, `_____ ____ = new ______;`, `____[_] = 31;`, `____[_] = ___________;`,
         `____[_] = arr_[_] + _________;`, `___ (______ element : ____) {`, `${tab}S_________._____(______ + '_'__`, `}`, `S_________._______(_______, _______, _______);`
        ].join(`\n${tab}${tab}`)
        + `\n${tab}}\n}`,
}
export const expectedOutput = {
    "1": ``,
    "11": `Hello, world!`,
    "12": `1.37`,
    "13": `Test passed!`,
    "14": [...Array(100).keys()].map(x => (x++)).join("\n"),
    "15": `1\n2\n4\n8\n16\n32\n64\n128\n256\n512\n1024\n2048`,
    "16": `java code typist code exercise 31 4 0`
}