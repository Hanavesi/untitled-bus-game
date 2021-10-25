import PlaySound from './PlaySound';
import { Link } from "react-router-dom";


export default function MenuList() {
  return (
    <div>
      <Link className="text-link" to="/">
        <button>Menu</button>
      </Link>
      <br />
      <Link className="text-link" to="/Game">
        <button>Game</button>
      </Link>{' '}
      <br />
      <Link className="text-link" to="/Map">
        <button>Bus Map</button>
      </Link>{' '}
      <br />
      <Link className="text-link" to="/Credits">
        <button>Credits</button>
      </Link>{''}
      <br />
      <PlaySound />
    </div>
  );
}