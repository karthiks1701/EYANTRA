/* This file sends and receives data to the tangle */







const Mam = require('/home/karthik/eyantra/mam/scripts/mam.node.js');
const IOTA = require('iota.lib.js');
const iota = new IOTA({ provider: 'https://nodes.devnet.iota.org:443' });
const MODE = 'public';
const SIDEKEY = 'mysecret'; 
const SECURITYLEVEL = 1;
const TIMEINTERVAL  = 30; 
let seed = '';
let json1;

let key;
let resp; 
let json;
let x=0;
let fun={};
let flag=0;
let message1;

 
 const args = process.argv;
 if(args.length !=4) 
    {
    console.log('wrong');
    } 
 else
    {
    json1 = args[3];
    seed= args[2];
    }

let mamState = Mam.init(iota,seed,1,0);



async function fetchStartCount()
 {
    
    let trytes = iota.utils.toTrytes(JSON.stringify(json1));
    message1 = Mam.create(mamState, trytes);
    console.log('The first root:');
    console.log(message1.root);
    console.log('messages in stream');
    console.log();
    execute(message1.root);
 
 }


if (MODE == 'restricted') 
 {
    
    key = iota.utils.toTrytes(SIDEKEY);
    mamState = Mam.changeMode(mamState, MODE, key);
 
 } 
else 
 {
    
    mamState = Mam.changeMode(mamState, MODE);
 
 }



 


const generateJSON = function() 
 {
 
    
    const data = Math.floor((Math.random()*89)+10);
    const json = data;
    console.log("attaching");
    console.log(json);
    return json;
 
 }

const publish = async function(packet) 
 {
    console.log("a");
    const trytes = iota.utils.toTrytes(JSON.stringify(packet));
    const message = Mam.create(mamState, trytes); 
    await Mam.attach(message.payload, message.address);
    mamState=message.state;
    console.log("attached");
    
    
 }

const executeDataPublishing = async function() 
 { 
    
    const root = await publish(json1);
    console.log(json1);
 }



const foor = function()
 {
    return "a";
 }

 

const execute = async (root) => 
 {

   
  resp = await Mam.fetchSingle(root, 'public', null);
   
   if(resp)
    {
     let json=JSON.parse(iota.utils.fromTrytes(resp.payload));
     x=x+1;
     console.log(json);
    }
   if (!resp)
     {   
         if(x==0)
         {
         await Mam.attach(message1.payload, message1.address);
         mamState=message1.state;
         console.log("attached"); 
         setInterval(foor(),30000);
         process.exit(1);          
         }
         if (x==1)
         {
         mamState=message1.state;
         } 
         console.log();
         console.log("messages in the stream over");
         console.log(x);
         for(let i=1;i<x;i++)
                 {
                      let trytes = iota.utils.toTrytes(JSON.stringify(i));
                      let message = Mam.create(mamState, trytes);
                      mamState=message.state;
                 }

         executeDataPublishing();
         setInterval(foor(),30000);
         process.exit(1);
     }
 
     execute(resp.nextRoot);
  
   
 }
    


fetchStartCount();


