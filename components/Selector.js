export default function Selector({selected}) {
    return (
        <select value={selected.get} onChange={(evt) => {selected.set(evt.target.value)}}>
            <option value={0}>Tutorial</option>
            <option value={1}>Challenge</option>
            <option value={2}>Free edit</option>
        </select>
    );
}