const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

const usdc = {
  address: "0x12BB890508c125661E03b09EC06E404bc9289040",
  abi: [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function gimmeSome() external",
    "function balanceOf(address _owner) public view returns (uint256 balance)",
    "function transfer(address _to, uint256 _value) public returns (bool success)",
  ],
};

function formatMoney(number, decPlaces, decSep, thouSep) {
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
    decSep = typeof decSep === "undefined" ? "." : decSep;
    thouSep = typeof thouSep === "undefined" ? "," : thouSep;
    var sign = number < 0 ? "-" : "";
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    var j = (j = i.length) > 3 ? j % 3 : 0;

    return sign +
        (j ? i.substr(0, j) + thouSep : "") +
        i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
        (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
}

function getValue(amount) {
  let url = `https://api.coinmarketcap.com/data-api/v3/tools/price-conversion?amount=${amount}&convert_id=2794&id=11346`;

  $.getJSON(url, function(data) {
    let val = Number(data["data"]["quote"][0]["price"].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
    console.log(val);
  });
}

async function main() {
  /*=======
    CONNECT TO METAMASK
    =======*/
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  let userAddress = await signer.getAddress();
  document.getElementById("userAddress").innerText =
    userAddress.slice(0, 8) + "...";

  /*======
    INITIALIZING CONTRACT
    ======*/
  const usdcContract = new ethers.Contract(usdc.address, usdc.abi, signer);

  let contractName = await usdcContract.name();
  // document.getElementById("contractName").innerText = contractName;
  let usdcBalance = await usdcContract.balanceOf(userAddress);
  console.log(usdcBalance);
  usdcBalance = ethers.utils.formatUnits(usdcBalance, 18);
  console.log(usdcBalance);
  // let formatter = new Intl.NumberFormat('en-US', {
  //   style: 'currency',
  //   // currency: 'IDR',
  // });
  // Number(usdcBalance).toFixed(0)
  let split = usdcBalance.split(".");
  console.log(split);
  getValue(usdcBalance);
  document.getElementById("usdcBalance").innerText = Number(usdcBalance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  // document.getElementById("usdcBalance").innerText = formatMoney(usdcBalance);
}
main();