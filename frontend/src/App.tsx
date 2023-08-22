import { useState } from "react";
import "./App.css";
import {
  useAccount,
  useConnect,
  useContractWrite,
  useContractRead,
} from "wagmi";
import NftArtifact from "./NftArtifact.json";
import {
  parseEther,
  BaseError,
  ContractFunctionRevertedError,
  formatEther,
} from "viem";

const errorMapping: Record<string, string> = {
  MaxSupplyExceeded: "Max supply exceeded",
  ValueNotEnough: "Value isn't enough",
  MaxPerWallet: "Max per wallet exceeded",
  FailedTransfer: "Sorry, isn't possible do the transfer, try again.",
  default: "Ops! There is some error.",
};

const contractAddress = `0x51CBe51d66dFd14dE39f7312f27e746f716Ce96f`;

function App() {
  const [total, setTotal] = useState(1);
  const [calcPrice, setCalcPrice] = useState<bigint>(0n);

  const {
    data: pricePerToken,
    isSuccess: pricePerTokenIsSuccess,
    isLoading: pricePerTokenIsLoading,
    isFetchedAfterMount,
  } = useContractRead({
    address: contractAddress,
    abi: NftArtifact.abi,
    functionName: "_pricePerToken",
  });

  const {
    writeAsync,
    data,
    isLoading: isMintLoading,
  } = useContractWrite({
    address: contractAddress,
    abi: NftArtifact.abi,
    functionName: "mint",
  });

  if (data) {
    console.log("data =>", data);
  }
  console.log("pricePerTokenIsSuccess", pricePerTokenIsSuccess);
  console.log("pricePerTokenIsLoading", pricePerTokenIsLoading);
  console.log("isFetchedAfterMount", isFetchedAfterMount);

  if (pricePerToken && calcPrice <= 0 && isFetchedAfterMount) {
    setCalcPrice(BigInt(pricePerToken as bigint));
  }

  const { isConnected } = useAccount();
  const { connect, connectors, isLoading } = useConnect();
  const [metamask] = connectors;

  async function handlerSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (!isConnected) {
        connect({ connector: metamask });
        return;
      }
      const price = 0.0001;
      const value = parseEther(String(total * price));
      await writeAsync({
        args: [total],
        value,
      });
    } catch (err) {
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (er) => er instanceof ContractFunctionRevertedError
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? "default";
          console.log("revertCustomError", errorName);
          alert(errorMapping[errorName]);
        }
      }
    }
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
            Você está em uma página de mint desenvolvida para interagir com um
            contrato de NFT que criei para meu canal no{" "}
            <a href="https://youtube.com/@nftchoose" target="_blank">
              Youtube.
            </a>
          </p>
          <hr />
          {!!pricePerToken && (
            <p>
              <strong>Price per NFT:</strong> {formatEther(calcPrice)}
            </p>
          )}
          <form onSubmit={handlerSubmit}>
            <input
              type="number"
              min={1}
              value={total}
              placeholder="Mint your NFT"
              onChange={({ target }) => {
                !!pricePerToken &&
                  setCalcPrice(
                    BigInt(pricePerToken as bigint) * BigInt(target.value)
                  );
                setTotal(Number(target.value));
              }}
            />
            <button disabled={isLoading || isMintLoading} type="submit">
              {isLoading || isMintLoading
                ? "Loading..."
                : "Mint a BoredApeYach Fake"}
            </button>
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
