/* GET the 'about' page */
const about = (req, res) => {
    // compile a view template to send as the html response
    res.render('generic-text', { title: 'About' });
    // name of template, {whatever data we need to pass in into the view}
};
module.exports = {
    about
};