$(document).ready(function(){
    $('#contact').validate({
        debug: true,
        errorClass: 'alert alert-danger',
        ErrorLabelContainer: '#output-area',
        errorElement: 'div',
        // rules to find good and bad inputs
        // each rule starts with the form input element's NAME attribute from the input fields
        rules: {
            name: {
                required: true
            },
            email: {
                email: true,
                required: true,
            },
            message: {
                require: true,
                maxlength: 2000
            }
        },
        messages: {
            name: {
            required: 'Name is required.'
        },
        email: {
            email: 'Please provide a valid email address.',
            required: 'Email is required.'
        },
        message: {
            required: 'A message is required.',
            maxlength: 'Message must be 2000 or less characters.'
        }
    },
    submitHandler: (form) => {
        $('#contact').ajaxSubmit({
            type: 'Post',
            url: $('#contact').attr('action'),
            success: (ajaxOutput) => {
                $('#output-area').css('display', '')
                $('#output-area').html(ajaxOutput)

                if ($('.alert-success') >= 1) {
                    $('#contact')[0].reset()
                }
            }
        })
    }
    })
})
