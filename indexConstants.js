// used in index.js

import { IBM_Plex_Mono } from "next/font/google";
import styles from "./styles/home.module.css";

export const plexMono = IBM_Plex_Mono({
    weight: "400",
    style: ["normal", "italic"],
    subsets: ["latin"]
});
export const tab = "    ";
export const styleKeys = {
    "not attempted": styles.not_attempted_button,
    "in progress": styles.in_progress_button,
    "complete": styles.complete_button
};
export const pageKeys = [0, 1, 11, 12, 13, 14, 21, 22];
export const pageData = [
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
export const classNames = {
    "1": `Program`,
    "11": `HelloWorld`,
    "12": `Variables`,
    "13": `IfElse`,
    "14": `ForLoop`,
}
export const instructions = {
    "1": 'Select an exercise to begin.',
    "11": 'Write a program that prints "Hello, world!" to the terminal.',
    "12": 'Declare two variables num1 and num2 with values 7 and -5.63. Declare a third variable num3 equal to the sum of num1 and num2, then print the value of num3.',
    "13": 'Declare two variables score and condition with values 15 and true. Use an if-else statement to print "Test passed!" if the score is greater than or equal to 12 and condition is true. Print "Try again." otherwise',
    "14": 'Write a program that prints the whole numbers from 1 to 100 using a for loop. Each number should be printed on a new line.'
};
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
}
export const expectedOutput = {
    "1": ``,
    "11": `Hello, world!`,
    "12": `1.37`,
    "13": `Test passed!`,
    "14": [...Array(100).keys()].map(x => (x++)).join("\n"),
}