/* GET home page */
const index = (req, res) => {
    res.render('index', { title: 'Express' });
    // compile a view template to send as the html response
};
module.exports = {
    index
};