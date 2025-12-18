/* This script uses vanilla JS to process the AJAX call. No jQuery required (save some bloat) */
var app,_submits, _form, _email_field;
var request = new XMLHttpRequest();

// Change this onload function to a click event
window.onload = function() {
    var _screen = document.getElementById(''); // This is only for testing, replace/remove
    var _submits = document.querySelectorAll('input[value="SIGN UP"]');

    request.onload = function(e) {
        var x = e.target;
        var response = JSON.parse(x.response);

        switch (x.status) {
            case 200:
            case 201:
                genSuccessField("You've been added to our list!", _email_field);
                break;
            case 400:
            case 422:
                switch (response.title.toLowerCase()) {
                    case "invalid resource":
                        genErrorField("Invalid email address", _email_field);
                        break;

                    case "member exists":
                        genErrorField("Email already subscribed!", _email_field);
                        break;

                    default:
                        genErrorField("There was a problem adding you to the list, please try again later.", _email_field);
                }
                break;
        }
    };

    addSubscriptionListeners();

    function setXhr() {
        request.open('POST', "https://api.whoamedia.com/lead/intake", true);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Allowance', '$2a$10$Pv8y4OZijL6R83V5ptYaHuWfR/mn1i2012ubrUxdzyx3PmBjVx5we')
    }

    function addSubscriptionListeners() {
        for (var i = 0; i < _submits.length; i++) {
            if (_submits[i].value.toLowerCase() == "sign up") {
              _form = $(_submits[i]).parents('form')[0];
			
              _submits[i].onclick = function(e) {
                console.log(a = $(e.target));
                  e.preventDefault();
                  _email_field = $(e.target).siblings('.field-wrap').find('input')[0];

                  if (typeof XMLHttpRequest != 'undefined') {
                      setXhr();
                  }

                  if (validateInput(_email_field) == true && validateEmail(_email_field) == true) {
                      request.send(JSON.stringify({email: _email_field.value, funnel: "93kfh39d0", source: "lwk91093jdpci1", list_id: "PSnxBJouF32mL5wq6i7635LA"}));
                  }
              };

              _form.onsubmit = function() {
                  return false;
              }
            }
        }
    }

    // TODO: simple form validation
    function validateInput(input) {
        if (input.value.length < 5) {
            genErrorField("Email can't be empty.", input);
            return false;
        } else {
            return true;
        }

    }

    function genErrorField(message, field) {
        field.value = message;
        field.style.color = '#cc0000';

        clearFieldListener(field);
    }

    function genSuccessField(message, field) {
        field.value = message;
        field.style.color = '#4BB543';
setTimeout(function(){
$('#poplock').modal('hide');
}, 2000);
        clearFieldListener(field);
    }

    function clearFieldListener(field) {
      field.onfocus = function() {
        this.value = "";
        this.style.color = "#a4a4a4";
      };
    }

    function validateEmail(input) {
        var re = /^(([^<>()[\]{}'^?\\.,!|\/\/#%*-+=&;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

        if (re.test(input.value) == true) {
            return true;
        } else {
            genErrorField("Invalid email address", input);
            return false;
        }
    }
};
