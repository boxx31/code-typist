//const url = "https://typistapi820.azurewebsites.net/";
const url = "http://localhost:5274";

export const runJavaCode = async (sessionId, className, code) => {
    try {
        const response = await fetch(`${url}/test/info`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId, className, code }),
          });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error(error.message);
    }
    return null;
};

export const runChat = async (userInstructions, page, mode, code, output) => {
    try {
        const response = await fetch(`${url}/test/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userInstructions, page, mode, code, output }),
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        return json;
    } catch (error) {
        console.error(error.message);
    }
    return null;
}