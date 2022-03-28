const https = require('https');
const fs = require("fs");


class StringData {
    constructor(data){
        this.data = data;
    }

    #search_one_string (dat,rep){
        let count = 0;
        for(let i=0;i<dat.length;i++){
            if(dat[i]===rep[0]&&(dat.length-i+1)>rep.length)
                for(let j =0; j<rep.length; j++)
                    if(dat[i+j] === rep[j]&&j===rep.length-1) count++;
        }
        return count;
    }

    #replace_one_string (dat,rep,source){
        let result = "";
        
        for(let i=0;i<dat.length;i++){
            
            if(dat[i]===rep[0]){
                for(let j =0; j<rep.length; j++){
                    if(dat[i+j] != rep[j]) break;
                    if(j===rep.length-1) {

                        result+=source;
                        i+=rep.length;
                    }
                }
            }
            if(dat[i]!=null)result+= dat[i];
            
        }
        return result;
    }

    replace(replacement){
        try{
    
            let result = [];
        
            this.data.forEach(dat => {
                let temp = [];
        
                replacement.forEach(rep => {
                    let sear = this.#search_one_string(dat,rep.replacement);
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
                    
                    str = this.#replace_one_string(str,temprep.replacement,temprep.source);
                });
                    
                if(str!='null')result.push(str);
                
            });
            return result;
        }
        catch(err){
            console.log(err);
            return [""];
        }
    }
}


let replacement = JSON.parse(fs.readFileSync("./replacement.json", 'utf-8'));
https.get("https://raw.githubusercontent.com/thewhitesoft/student-2022-assignment/main/data.json", res => {
        //console.log(`statusCode: ${res.statusCode}`)
        res.on('data', d => {
            let data = new StringData (JSON.parse(d));
            let result = data.replace(replacement);
            fs.writeFileSync("./result.json",JSON.stringify(result),'utf-8');
    })
});

