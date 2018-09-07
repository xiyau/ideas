if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI: 'mongodb://hackode:Sndvol32@@ds249372.mlab.com:49372/idea-prod'
    }
}else{
    module.exports = {
        mongoURI: 'mongodb://localhost/ideas'
    }
}