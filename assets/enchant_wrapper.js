// initialize vars
var form, name_field, e_fname, e_lname, e_city, e_state, e_zip, e_phone, e_social, e_social_network, e_photo_front, e_photo_side, e_photo_back, email_field, subject_field, message_field, submit_button, original_btn_value, attachments_set = new Array(), files, output = new Array(), errors = new Array(), dataset;
var req = new XMLHttpRequest();

document.addEventListener("DOMContentLoaded", function (event) {
    // map all fields with relevant data to appropiate var
    form = document.getElementById('enchant_form');
    name_field = document.getElementById('name');
    label_field = document.getElementById('enchant_label');
    email_field = document.getElementById('email');
    subject_field = document.getElementById('subject');
    message_field = document.getElementById('message');
    mailbox_field = document.getElementById('mailbox_name');
    form_title_field = document.getElementById('form_title');
    submit_button = document.getElementById('enchant_submit');
    files = document.querySelectorAll('[id^=files]');
    e_fname = document.getElementById('name');
    e_lname = document.getElementById('enchant_lname');
    e_city = document.getElementById('enchant_city');
    e_state = document.getElementById('enchant_state');
    e_zip = document.getElementById('enchant_zip');
    e_phone = document.getElementById('enchant_phone');
    e_social = document.getElementById('enchant_social');
    e_social_network = document.getElementById('enchant_social_network');

    // Setup events
    setListeners();
});

// Where the API call will live
function sendData(e) {
    e.preventDefault();
    disableSubmit(true);

    // Validate fields
    if (whoaValidation() == true) {
        original_btn_value = submit_button.innerText;

        submit_button.innerText = "Sending...";

        setXhr();

        var _subject = subject_field.value.toLowerCase();

        switch (true) {
            case /modeling/.test(_subject):
                var m = modelingPackager();
                dataset = {name: m[0].trim(), email: email_field.value.trim(), subject: subject_field.value.trim(), message: m[1].trim()};
                break;
            default:
                dataset = {
                    name: name_field.value.trim(),
                    email: email_field.value.trim(),
                    subject: subject_field.value.trim(),
                    message: message_field.value.trim(),
                    mailbox_name: mailbox_field.value.trim(),
                    form_title: form_title_field.value.trim(),
                    attachments: attachments_set
                };
        }
        dataset.mailbox = mailbox_field.value.trim();
        req.send(JSON.stringify(dataset));
    } else {
        disableSubmit(false);
    }
}

// Setup XHR
function setXhr() {
    req.open("POST", "https://api1.whoamapi.com/api/tickets/intake");
    req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Allowance', 'key');
    req.setRequestHeader('Authorization', 'Bearer 3|D6arSWSqc03QEVLWBjToz6foneCUUNm3cyWMADKu')
}

// Check if browser supports FileAPI
function checkFileAPI() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        return true;
    } else {
        return false;
    }
}

function handleFileSelect(evt) {
    var _files = evt.target.files;
    for (var i = 0, f; f = _files[i]; i++) {
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function (e) {
                // Send base64 image to attachments_set
                attachments_set.push(e.target.result);
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}

function validator() {

    // Clear error collection
    errors = [];

    // Check for empty inputs excluding: [file, submit]
    form.querySelectorAll('textarea,input:not([type="file"]):not([type="submit"])').forEach(function (field, index) {
        var _name = field.id.replace('enchant_', '');
        if (field.value == "") {
            errors.push(throwMessage(_name + " cannot be blank.", field, true));
            return false;
        } else if (field.value.toLowerCase().includes("cannot be blank.") || field.value.toLowerCase().includes("invalid")) {
            errors.push(throwMessage(field.value, field, true));
            return false;
        }

        // Custom/specific validation by name
        switch (_name) {
            case 'name':

                break;
            case 'email':
                var re = /^(([^<>()[\]{}'^?\\.,!|\/\/#%*-+=&;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

                if (re.test(field.value) == true) {

                } else {
                    errors.push("Invalid email address");
                    pushError("Invalid email address", field);
                }
                break;

            case 'subject':

                break;

            case 'message':

                break;
            default:

        }
    });

    if (errors.length > 0) {
        return false;
    } else {
        return true;
    }
}

function throwMessage(message, field, error = false) {
    if (field.type != "file") {
        field.placeholder = message;
    }

    return field;
}

function grabUserFiles(e) {
    _files = e.target.files; // FileList object

    // files is a FileList of File objects. List some properties.
    //output = [];

    for (var i = 0, f; f = _files[i]; i++) {
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') </li>');
    }

    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
    attachments_set.push();
}

function fireCallResponse(resp, field_id, message_type) {
    _field = document.getElementById(field_id);

    // Clear response elements
    try {
        _field.value = "";
    } catch (err) {
        console.log(err);
    }

    // Clear color
    var _color = "";

    switch (message_type) {
        case "success":
            _color = "#4BB543";
            break;

        case "error":
            _color = "#CC0000";
            break;
        default:

    }

    _field.innerHTML = resp;
    _field.style.color = _color;
    _field.style.fontWeight = "bold";
}

function disableSubmit(n) {
    submit_button.disabled = n;
}

// Global listener initializer
function setListeners() {
    // Set listener for submit button
    submit_button.addEventListener('click', sendData, false);
    files.forEach(function (file, i) {
        file.addEventListener('change', grabUserFiles, false);
        file.addEventListener('change', handleFileSelect, false);
    });
    //document.getElementsByClassName('uploader')[0].addEventListener('click', function() { files.click() });
    form.onsubmit = function () {
        return false;
    }

    // API Request listener
    req.onload = function (e) {
        disableSubmit(true);

        switch (e.target.status) {
            case 200:
            case 201:
                submit_button.innerText = "SENT";
                
                fireCallResponse("Thanks for the feedback! A member of our team will get back to you shortly.", "enchant-success", "success");
                        document.getElementById('enchant-success').style.display = 'block';


                break;

            case 400:
                submit_button.innerText = original_btn_value;
                fireCallResponse("Please fix the errors above before submit the form again.", "enchant-error", "error");
                   document.getElementById('enchant-error').style.display = 'block';
                break;
            case 500:
                submit_button.innerText = original_btn_value;
                fireCallResponse("There was a problem with your submission. We're addressing the issue.", "enchant-error", "error");
                   document.getElementById('enchant-error').style.display = 'block';
                disableSubmit(false);
                break;

            default:

        }
    };
}

function setFormType() {
    switch (subject_field.value.toLowerCase()) {
        case "customer help":

            break;

        case "feedback":

            break;

        case "model for us":

            break;
        default:

    }
}

function modelingPackager() {
    var message_body = "";
    var generated_fullname = "";

    generated_fullname = e_fname.value.trim() + " " + e_lname.value.trim();
    message_body = "Name: " + generated_fullname + "\n\nEmail: " + email_field.value.trim() + "\n\nCity: " + e_city.value + "\n\nState: " + e_state.value + "\n\nZip code: " + e_zip.value.trim() + "\n\nPhone: " + e_phone.value.trim() + "\n\n" + e_social_network.value.trim() + ": " + e_social.value.trim();


    return [generated_fullname, message_body];
}

// Library
function whoaValidation() {
    var form_list, required_elements, errors = new Array();

    // Get all forms
    form_list = document.querySelectorAll('form');

    form_list.forEach(function (f, i) {
        // initialize vars
        required_elements = f.querySelectorAll('.req');

        // Check all required elements

        required_elements.forEach(function (el, i) {

            if (el.value == "") {
                throwMessage(el.name + " is required.", el, true);
                // Give .whoa-error className
                if (!el.classList.contains('is-invalid')) {
                    el.className += " is-invalid";
                }
                errors.push(el);
            } else {
                if (el.id == "email") {
                    var re = /^(([^<>()[\]{}'^?\\.,!|\/\/#%*-+=&;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

                    if (re.test(el.value) == true) {
                        document.getElementById('error-email-message').style.display = 'none';
                    } else {
                        throwMessage(el.name.replace('enchant_', '') + " is invalid.", el, true);
                        // Give .whoa-error className
                        if (!el.classList.contains('is-invalid')) {
                            el.className += " is-invalid";
                        }
                        document.getElementById('error-email-message').style.display = 'block';
                        errors.push(el);

                    }
                }
            }
        });

    });

    // Set Listeners
    document.querySelectorAll('.is-invalid').forEach(function (error, i) {
        error.addEventListener('focus', function (e) {
            this.classList.remove('is-invalid');

        }, false);
    });

    // return

    if (errors.length > 0) {
        return false;
    } else {
        return true;
    }
}
