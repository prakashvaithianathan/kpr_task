import {useState,useEffect} from 'react'
import './App.css';
import contractAddress from './web3/contractAddress';
import contractABI from './web3/contractABI.json'
import Web3 from 'web3'



function App() {
const [walletAddress, setWalletAddress] = useState(null)
const [tokenBalance, setTokenBalance] = useState(null)
const [tokenValue, setTokenValue] = useState({
  walletDetails:null,
  tokenAmount:null
})
  const web3 = new Web3(window.ethereum)

  const contractInstance = new web3.eth.Contract(contractABI,contractAddress)


  useEffect(()=>{
   const getData = async()=>{
    
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setWalletAddress(account[0])
     const getBalance = await contractInstance.methods.balanceOf(account[0]).call()
     setTokenBalance(getBalance);
   }
   getData()
  },[])

  const handleChange = (e)=>{
    const {name,value} = e.target
 setTokenValue((prev)=>{
  return{
    ...prev,
    [name]:value
  }
 })
  }

  const handleSubmit = async()=>{
    try {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(tokenValue,account[0]);
      const mintToken = await contractInstance.methods.mint(tokenValue.walletDetails,tokenValue.tokenValue).send({
        from:account[0]
      })
      const getBalance = await contractInstance.methods.balanceOf(account[0]).call()
     setTokenBalance(getBalance);
    } catch (error) {
      alert(error.message)
    }
  }


  return (
    <div className="App" >
      <img src= "https://media-exp2.licdn.com/dms/image/C4D0BAQG8V1nXicp4kg/company-logo_200_200/0/1650449546465?e=2147483647&v=beta&t=AojC06T033NrDqFaimxvXe_Sci2RD1vz9Yf_yP6N9Mk" alt="kpr"/>
 
    <h1>ERC 20 TOKEN(Goerli Testnet)</h1>

    <ul >
      <p>Wallet Address: &nbsp; {walletAddress}</p>
      <p >Token Balance: &nbsp; {tokenBalance}</p>
    </ul>

<h3>Mint Token</h3>

<ul style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'10px'}}>
  <input type="text" placeholder="Wallet Address" onChange={handleChange} name="walletDetails"/>
  <input type="text" placeholder="Token Amount" onChange={handleChange} name="tokenValue"/>
  <button onClick={handleSubmit}>Mint</button>
</ul>
  
    </div>
  );
}

export default App;
