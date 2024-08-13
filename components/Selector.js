export default function Selector({onChange}) {
    return (
        <select onChange={(evt) => {onChange(evt.target.value)}}>
            <option value={0}>Tutorial</option>
            <option value={1}>Time challenge</option>
            <option value={2}>Free edit</option>
        </select>
    );
}