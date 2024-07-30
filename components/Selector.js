export default function Selector({handler}) {
    return (
        <select onChange={handler}>
            <option>Select mode...</option>
            <option>Tutorial</option>
            <option>Free edit</option>
        </select>
    );
}