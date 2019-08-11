// for validating review-form on client/browser side
// Express treats the public folder as static files, so this is downloaded to user's browser and run there

/**
 * Jquery function for when the 'add review' button is clicked to submit form
 * Displays a message to user if all fields were not entered.
 */
$('#addReview').submit(function (e) {
    $('.alert.alert-danger').hide();
    if (!$('input#name').val() || !$('select#rating').val() || !$('textarea#review').val()) {
        if ($('.alert.alert-danger').length) {
            $('.alert.alert-danger').show();
        } else {
            $(this).prepend('<div role="alert" class="alert alert-danger"> All fields required, please try again</div > ');
        }
        return false;
    }
});