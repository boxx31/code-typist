export default function Editor({text}) {
    return (
        <textarea rows={20} cols={100} value={text.get} onChange={e => text.set(e.target.value)} />
        /*<div>
            <Row />
            <Row />
            <Row />
        </div>*/
    );
}

function Row() {
    return (
        <div style={{"display": "flex"}}>
            <Character />
            <Character />
            <Character />
        </div>
    );
}

function Character() {
    return (
        <p>a</p>
    );
}