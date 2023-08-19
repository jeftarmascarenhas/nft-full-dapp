import { useState } from "react";
import "./App.css";

function App() {
  const [total, setTotal] = useState(1);
  const isConnected = false;

  async function handlerSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <>
      <header>
        <h1>Mint a BoredApeYach Fake</h1>
      </header>
      <section className="section">
        <div className="thumbnail">
          <img
            src="https://ipfs.io/ipfs/QmRRPWG96cmgTn2qSzjwr2qvfNEuhunv6FNeMFGa9bx6mQ"
            alt="NFT Choose - BoredApeYachFake"
          />
          <p>
            <a href="#">Open on github</a>
          </p>
        </div>
        <article className="article">
          <h2>About</h2>
          <p>
            <strong>EN</strong>
            <br />
            You are on a mint page designed to interact with an NFT contract I
            created for my{" "}
            <a href="https://youtube.com/@nftchoose" target="_blank">
              YouTube
            </a>{" "}
            channel.
          </p>
          <hr />
          <p>
            <strong>PT_BR</strong>
            <br />
            Você está em uma página de menta desenvolvida para interagir com um
            contrato de NFT que criei para meu canal no{" "}
            <a href="https://youtube.com/@nftchoose" target="_blank">
              Youtube.
            </a>
          </p>
          <hr />
          <form onSubmit={handlerSubmit}>
            <input
              type="number"
              min={1}
              value={total}
              placeholder="Mint your NFT"
              onChange={({ target }) => setTotal(Number(target.value))}
            />
            <button type="submit">Mint a BoredApeYach Fake</button>
            {isConnected && <p className="text-center">You are connected</p>}
          </form>
        </article>
      </section>
      <footer className="footer">
        <a href="https://youtube.com/@nftchoose" target="_blank">
          Develop by Jeftar Mascarenhas with &#10084;
        </a>
      </footer>
    </>
  );
}

export default App;
