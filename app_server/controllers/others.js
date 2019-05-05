/* GET the 'about' page */
const about = (req, res) => {
    res.render('generic-text', { title: 'About' });
    // compile a view template to send as the html response
};
module.exports = {
    about
};