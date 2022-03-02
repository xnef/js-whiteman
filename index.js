
let data = [],replacement = [];
const https = require('https');

const fs = require("fs");

function search (dat,rep){
    let count = 0;
    for(let i=0;i<dat.length;i++){
        if(dat[i]===rep[0]&&(dat.length-i+1)>rep.length)
            for(let j =0; j<rep.length; j++)
                if(dat[i+j] === rep[j]&&j===rep.length-1) count++;
    }
    return count;
}
function replace (dat,rep,source){
    let resstr = "";
    
    for(let i=0;i<dat.length;i++){
        
        if(dat[i]===rep[0]){
            for(let j =0; j<rep.length; j++){
                if(dat[i+j] != rep[j]) break;
                if(j===rep.length-1) {
                    resstr+=source;
                    i+=rep.length;
                    continue;
                }
            }
        }
        if(dat[i]!=null)resstr+= dat[i];
        
    }
    return resstr;
}
function main(){
    try{
    
   
        
        
        
        let result = [];
    
        data.forEach(dat => {
            let temp = [];
    
            replacement.forEach(rep => {
                let sear = search(dat,rep.replacement);
                if (sear !=0) 
                    for(let i =0;i<sear;i++)temp.push(rep);
                
            });
    
            if(temp.length===0) {
                result.push(dat);
                
                return;
                
            }
    
            
            for(let i =0; i<temp.length;i++)
                for(let j =0; j<temp.length;j++){
                    if(temp[i].replacement===temp[j].replacement) {
                        if(i<j)temp[i]=temp[j];
                        if(i>j)temp[j]=temp[i];
                    }
                    if(temp[i].replacement.length>temp[j].replacement.length&&i>j){
                        let t = temp[j];
                        temp[j] = temp[i];
                        temp[i] = t;
                    }
                }
            
                    
            let str = dat;
            temp.forEach(temprep => {
                
                str = replace(str,temprep.replacement,temprep.source);
            });
                
            if(str!='null')result.push(str);
            
        });
        fs.writeFileSync("./result.json",JSON.stringify(result),'utf-8');
        
    }
    catch(err){
        console.log(err);
    }
}

replacement = JSON.parse(fs.readFileSync("./replacement.json", 'utf-8'));
https.get("https://raw.githubusercontent.com/thewhitesoft/student-2022-assignment/main/data.json", res => {
        //console.log(`statusCode: ${res.statusCode}`)
        res.on('data', d => {
          data = JSON.parse(d);
          main();
        })
      })

