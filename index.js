const http = require('http');
const request = require('request');
const fs = require('fs');
const path = require('path');
const url = require('url');
const cheerio = require('cheerio');

let domain = 'https://amazon.in';
let param1 = '/s?k=';
let param2 = '&ref=nb_sb_noss';


const server = http.createServer((req,res)=>{
    //console.log(req.url);
    let pathname = url.parse(req.url, true).pathname;
    let getQuery = url.parse(req.url, true).query;
    //console.log(query);
    //console.log(pathname);

    let filePath = path.join(
        __dirname,
        pathname === '/' ? 'index.html' : pathname
        );

    //extension of file
    let extname = path.extname(filePath);

    //content Type
    let contentType = 'text/HTML';

    //check ext and set content type
    switch(extname){
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }

    //readFile
    fs.readFile(filePath, (err,content)=>{
        if(err) {
            if (err.code == 'ENOENT') {
                fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
                    if (err) throw err;

                    res.writeHeader(200, {'Content-Type': 'text/HTML'});
                    res.end(content);
                })
            } else {
                res.writeHeader(500, {'Content-Type': 'text/HTML'});
                res.end(`
                    some error has occured
                    Error code: ${err.code}
                `);
            }
        }else{
            if(getQuery != {} && filePath =='/search.html')
            {
                let requestURL = `${domain}${param1}${getQuery['item']}${param2}`;
                console.log(requestURL);
                request(requestURL, (err,res,body)=>{
                    //console.log('error: ', err);
                    //console.log('res: ',res);
                    const $ = cheerio.load(body);

                    let nameList = Array.from($('a.a-link-normal.a-text-normal span.a-color-base.a-text-normal' ));

                    /*nameList.forEach((data)=>{
                        console.log(data.children[0]['data']);
                    });*/

                    let priceList = Array.from($('a.a-size-base.a-link-normal.s-no-hover.a-text-normal span.a-price-whole' ));
                    //console.log(priceList);
                    /*priceList.forEach((data)=>{
                        console.log(data.children[0]['data']);
                    });*/
                    //console.log('name length', nameList.length);
                    //console.log('price length', priceList.length);
                    for(let i=0;i<nameList.length;i++)
                    {
                        console.log(nameList[i].children[0]['data']);
                        console.log(priceList[i].children[0]['data']);
                    }
                });
            }

            res.writeHeader(200, {'Content-Type': contentType});
            res.end(content);
        }
    });



});
const PORT = process.env.port || 5000;
server.listen(PORT,()=> console.log(`server is listening on port ${PORT}`));

