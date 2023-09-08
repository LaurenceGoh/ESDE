var jwt = require('jsonwebtoken')
var validateFn = {
    validateSubmission: (req,res,next) => {
        var title = req.body.designTitle;
        var descripton = req.body.designDescription;
        var id = req.body.fileId;

        console.log(title);
        console.log(descripton);
        console.log(id);
        
        var regexTitle = new RegExp(`^[\\w\\s]+$`);
        var regexText = new RegExp(`^[\\w\\s.]+$`);
        var regexId = new RegExp(`^\\d+$`);

        if (regexTitle.test(title) && regexText.test(descripton) && regexId.test(id)){
            next();
        }
        else {
            res.status(400).send(`{"error" : "Invalid data"}`);
        }
    },
    

}




module.exports = validateFn;