const url = "http://localhost:5274";

export const runJavaCode = async (className, code) => {
    try {
        const response = await fetch(`${url}/test/info`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ className, code }),
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