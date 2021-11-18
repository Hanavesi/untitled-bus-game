import { Link } from "react-router-dom";


export default function MenuList() {
  return (
    <div>
      <Link className="text-link" to="/Game">
        <button className="menuButton">Game</button>
      </Link>{' '}
      <br />
      <Link className="text-link" to="/Map">
        <button className="menuButton">Bus Map</button>
      </Link>{' '}
      <br />
      <Link className="text-link" to="/instructions">
        <button className="menuButton">instructions</button>
      </Link>{' '}
      <br />
      <Link className="text-link" to="/Credits">
        <button className="menuButton">Credits</button>
      </Link>{''}
      <br />
    </div>
  );
}