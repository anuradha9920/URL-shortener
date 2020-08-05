const express = require('express');
const path=require('path');
const app=express();
const port=5000;

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended: true}));
app.use(express.static('assets'));

const db=require('./config/mongoose');
const ShortUrl=require('./models/URLS');


app.get('/',(req,res)=>{
    ShortUrl.find({},(err,urlsList)=>{
        if(err){
            console.log("Error in fetching URLs from db");
            return;
        }
        return res.render('home',{ 
            title:"My Urls",
            url_list: urlsList
        });
    }); 
});

app.post('/shortUrls',(req,res)=>{
    ShortUrl.create({
        full: req.body.fullURL,
        click:1
    },(err)=>{
        if(err){
            console.log("error in creating a contact");
            return;
        }
        return res.redirect('back');
    });
});

app.get('/delete-url',(req,res)=>{
    let id=req.query.id;
    ShortUrl.findByIdAndDelete(id,(err)=>{
        if(err){
            console.log("error in deleting the contact");
            return;
        }else{
            console.log("url deleted");
            return res.redirect('back');
        }
    });
});

app.get('/:shortUrl',(req,res)=>{
    let short=req.params.shortUrl;
    ShortUrl.find({short:short},(err,urlsList)=>{
        if(err || urlsList==null){
            console.log("Error occured while redirecting");
            return;
        }
        for(i of urlsList){
            i.clicks=i.clicks+1;
            ShortUrl.findByIdAndUpdate(i._id,{clicks:i.clicks},(err)=>{
                if(err){
                    console.log("unable to update");
                    return;
                }
            });
            return res.redirect(i.full);
        }
    });
});

app.listen(process.env.PORT||port,(err)=>{
    if(err){
        console.log("error : ",err);
        return;
    }
    console.log("server is up at port number  : ",port);
});