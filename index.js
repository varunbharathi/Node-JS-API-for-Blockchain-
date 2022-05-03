const express=require("express"); 
const PORT=process.env.PORT || 3000;
const app= express();
var Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const {create}= require("ipfs-http-client");
var cors = require('cors');
app.use(cors());

var SmartContractAddress = "0xf9b9114482f3adc263e2c388d3eedca46189bc63";//deployed smart contract address 

const API_KEY="8296576590265498";

app.get("/fetchData",async (req,res)=>{

    if(API_KEY==req.headers.apikey)
    {

    var userid=req.headers.email;

    var data = await getData(userid);
	if(data)
	{
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', `*`);
    res.setHeader('Access-Control-Allow-Methods', `GET, OPTIONS`);
    res.setHeader('Access-Control-Allow-Headers' , "email, Content-Type, apikey");
    res.send(data);
	}
	else{
		res.send(null);
	}
}
else
{
    res.send(null);
}

})




    var SmartContractABI =[
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "useremail",
                    "type": "string"
                }
            ],
            "name": "GetArray",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_key",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_value",
                    "type": "string"
                }
            ],
            "name": "add",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_key",
                    "type": "string"
                }
            ],
            "name": "contains",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_key",
                    "type": "string"
                }
            ],
            "name": "getByKey",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "useremail",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "hash",
                    "type": "string"
                }
            ],
            "name": "pushArray",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_key",
                    "type": "string"
                }
            ],
            "name": "remove",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];
    
    
    var privatekey = "65cb75f72aa99328cdaa3ea8117208b21fa06cf0f59dc22b4213622eb5e5ea3c"; //Account private key 
    var rpcurl = "https://ropsten.infura.io/v3/c9691255c2934d1ca1bf724598e67fb6"; //ropsten URL 
    
    
    
    //creating Infura node for IPFS 
    async function ipfsClient() 
    {
      const ipfs =  await create(
        {
          host: "ipfs.infura.io",
          port: 5001,
          protocol: "https"
        }
      );
      return ipfs;
    }
    
    const getData = async (userid) => {
        var provider = new Provider(privatekey, rpcurl);
        var web3 = new Web3(provider);
        var contract = new web3.eth.Contract(SmartContractABI, SmartContractAddress);
        var hash = await contract.methods.GetArray(userid).call();
        if(hash!="null")
        {var prevdata = await getDataIPFS(hash);
        console.log("JSON data of user:", prevdata);
    }
    return prevdata;
        }
    
        async function getDataIPFS(hash) {
            let ipfs = await ipfsClient();
          
            let asyncitr = ipfs.cat(hash)
          
            for await (const itr of asyncitr) {
          
              let data = Buffer.from(itr).toString()
              return data;
            }
          }
    





app.listen(PORT, function(){


    console.log("SERVER STARTED ON localhost:3000");     
})
