import BN from "bn.js";
import { useRecoilValueLoadable } from "recoil";
import { TwitterShareButton, TwitterIcon } from "react-share";
import { queryAddressInfo } from "../../selectors/gitcoin";
import { FLEEK_URL } from "../../constants/fleek";

const Gitcoin = ({ address }) => {
  const result = useRecoilValueLoadable(
    queryAddressInfo(address && address.toLowerCase())
  );

  const shareUrl = `${FLEEK_URL}?address=${address}`;
  const title = `Thanks for supporting my @gitcoin Steward, please delegate ${address} `;

  switch (result.state) {
    case "hasValue":
      const { account, delegators } = result?.contents;
      // setWallet({ account, delegators });
      if (!account)
        return (
          <div className="flex items-stretch h-screen">
            <div className="self-center flex-1 text-center">
              <p className="text-5xl text-center text-red-500">
                Address Not Data!
              </p>
            </div>
          </div>
        );
      const { votes, ballotsCastCount, tokenBalance } = account;

      new BN(votes).div(new BN(10).pow(new BN(18))).toString();
      return (
        <div className="container mx-auto ">
          <div className="flex">
            <div className="flex-none w-40 mt-4 mb-0 bg-gray-50">
              <p className="text-2xl text-center text-purple-500"></p>
              <div className="w-full h-1 bg-purple-500"></div>
            </div>
            <div className="flex flex-grow h-16 m-4 mb-0 mr-0 bg-gray-50">
              <div className="flex justify-center w-full">
                <div className="w-40">
                  <div className="text-center">
                    {new BN(votes).div(new BN(10).pow(new BN(18))).toString()}
                  </div>
                  <div className="text-center text-gray-500">Total votes</div>
                </div>
                <div className="w-40">
                  <div className="text-center">{ballotsCastCount}</div>
                  <div className="text-center text-gray-500">Ballots</div>
                </div>
                <div className="w-40">
                  <div className="text-center">
                    {new BN(tokenBalance)
                      .div(new BN(10).pow(new BN(18)))
                      .toString()}
                  </div>
                  <div className="text-center text-gray-500">Total tokens</div>
                </div>
                <div className="w-40">
                  <TwitterShareButton
                    url={shareUrl}
                    title={title}
                    className="Demo__some-network__share-button"
                  >
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row-reverse">
            <div className="flex flex-col flex-none w-72 bg-gray-50">
              <div className="p-5">
                <div>
                  <p className="text-xl leading-7 text-purple-900">
                    Top Delegators
                  </p>
                  <p className="text-gray-500">
                    Ranking by delegated percentage
                  </p>
                </div>
              </div>

              {delegators.map((item: any, index: any) => {
                const itemBalance = item.tokenBalance;
                const id = item.id;
                if (itemBalance == "0") return;

                return (
                  <div className="flex" key={index}>
                    <div className="flex-auto pt-1">
                      <p className="m-1 text-center">{index}</p>
                    </div>
                    <div className="flex-auto pt-1 ">
                      <p className="m-1 text-center">
                        {id.substring(0, 6) +
                          "..." +
                          id.substring(id.length - 4)}
                      </p>
                    </div>
                    <div className="flex-auto pt-1">
                      <p className="m-1 text-center">
                        {(
                          ((itemBalance as any) / (tokenBalance as any)) *
                          100
                        ).toFixed(2) + "%"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    case "loading":
      return <div>Loading...</div>;
    case "hasError":
      throw result.contents;
  }
};

export default Gitcoin;
