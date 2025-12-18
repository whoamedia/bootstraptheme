// initialize vars
var form, name_field, e_fname, e_lname, e_city, e_state, e_zip, e_phone, e_social, e_social_network, e_photo_front, e_photo_side, e_photo_back, email_field, subject_field, message_field, submit_button, original_btn_value, attachments_set = new Array(), files, output = new Array(), errors = new Array(), dataset;
var req = new XMLHttpRequest();

$(document).ready(function(){
    console.log('call ready');
    // map all fields with relevant data to appropiate var
    form = $("#enchant_form");
    name_field = $("#enchant_name");
    label_field = $("#enchant_label");
    email_field = $("#enchant_email");
    subject_field = $("#enchant_subject");
    message_field = $("#enchant_message");
    mailbox_field = $("#mailbox_name");
    submit_button = $("#enchant_submit");
    files = $('[id^=files]');
    e_fname = $("#enchant_fname");
    e_lname = $("#enchant_lname");
    e_city = $("#enchant_city");
    e_state = $("#enchant_state");
    e_zip = $("#enchant_zip");
    e_phone = $("#enchant_phone");
    e_social = $("#enchant_social");
    e_social_network = $("#enchant_social_network");

    // Setup events
    setListeners();
});

// Where the API call will live
function sendData(e) {
  e.preventDefault();
  disableSubmit(true);
	
  // Validate fields
  if(whoaValidation() == true) {
    original_btn_value = submit_button.text();

    submit_button.text("Sending...");

    setXhr();

    var _subject = $(subject_field).val().toLowerCase();

    switch(true) {
      case /modeling/.test(_subject):
        var m = modelingPackager();
        dataset = {name: m[0].trim(), email: $(email_field).val().trim(), subject: $(subject_field).value.trim(), message: m[1].trim(), attachments: attachments_set};
        break;
      default:
        dataset = {name: $(name_field).val().trim(), email: $(email_field).val().trim(), subject: $(subject_field).val().trim(), message: $(message_field).val().trim(), attachments: attachments_set};
    }
    dataset.mailbox_name = $(mailbox_field).val().trim();
    req.send(JSON.stringify(dataset));
  } else {
    disableSubmit(false);
  }
}

// Setup XHR
function setXhr() {
  req.open("POST", "https://api.whoamedia.com/tickets/intake");
  //req.open("POST", "http://enchant.development/v1/tickets");
  req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  req.setRequestHeader('Content-Type', 'application/json');
  req.setRequestHeader('Allowance', '$2a$10$Pv8y4OZijL6R83V5ptYaHuWfR/mn1i2012ubrUxdzyx3PmBjVx5we');
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
    if (!f.attr('type').match('image.*')) {
      continue;
    }

    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
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
  form.find('textarea,input:not([type="file"]):not([type="submit"])').each(function(field,index) {
    var _name = field.attr('id').replace('enchant_','');
    if(field.value == "") {
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

  if(errors.length > 0) {
    return false;
  } else {
    return true;
  }
}

function throwMessage(message, field, error = false) {
    if(field.attr('type') != "file") {
        field.attr("placeholder", message);
    }

    return field;
}

function grabUserFiles(e) {
  _files = e.target.files; // FileList object

  // files is a FileList of File objects. List some properties.
  //output = [];

  for (var i = 0, f; f = _files[i]; i++) {
    output.push('<li><strong>', escape(f.attr('name')), '</strong> (', f.attr('type') || 'n/a', ') </li>');
  }

  var createHtml = '<ul>' + output.join('') + '</ul>';
  $('list').html(createHtml);
  attachments_set.push();
}

function fireCallResponse(resp, field_id, message_type) {
  var _field = $("#"+field_id);
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

  _field.html(resp);
  _field.css("color", _color);
  _field.css("fontWeight", "bold");
}

function disableSubmit(n) {
  submit_button.prop('disabled', n);
}

// Global listener initializer
function setListeners() {
  console.log('call setListeners');
  // Set listener for submit button
  $(submit_button).on('click', sendData);
  
  $(files).each(function(file) {
    file.on('change', grabUserFiles);
    file.on('change', handleFileSelect);
  });
  //document.getElementsByClassName('uploader')[0].addEventListener('click', function() { files.click() });
  form.submit(function() { return false; });

  // API Request listener
  req.onload = function(e) {
    disableSubmit(true);

    switch (e.target.status) {
      case 200:
      case 201:
        submit_button.text("SENT");
        submit_button.css("display","none");
        fireCallResponse("Your message has been delivered! A member of our team will get back to you shortly.", "enchant-success", "success");
   
        break;

      case 400:
        submit_button.text(original_btn_value);
        fireCallResponse("There was a problem with your submission. We're addressing the issue.", "enchant-error", "error");
        break;

      default:

    }
  };
}

function setFormType() {
  switch ($(subject_field).value.toLowerCase()) {
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
  message_body = "Name: " + generated_fullname + "\n\nEmail: " + email_field.value.trim() + "\n\nCity: " + e_city.value + "\n\nState: " + e_state.value + "\n\nZip code: " + e_zip.value.trim() + "\n\nPhone: " + e_phone.value.trim() + "\n\n" + e_social_network.value.trim() + ": "  + e_social.value.trim();


  return [generated_fullname,message_body];
}

// Library
function whoaValidation() {
  var form_list, required_elements, errors = new Array();
	
  // Get all forms
  form_list = $('form');
	
  form_list.each(function(f,i) {
    // initialize vars
    required_elements = $(f).find('.req');

    // Check all required elements
    
    required_elements.each(function(el,i){
      
      if(el.value == "") {
        throwMessage(el.attr('name').replace('enchant_','')+" is required.", el, true);
        // Give .whoa-error className
        if(!el.hasClass('whoa-error')) {
            el.addClass(" whoa-error");
        }
        errors.push(el);
      }
      else{
      	if(el.attr('id') == "enchant_email")
        {
          var re = /^(([^<>()[\]{}'^?\\.,!|\/\/#%*-+=&;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

          if (re.test(el.value) == true) 
          {
				$('error-email-message').css("display","none");
          } 
          else 
          {
            throwMessage(el.attr('name').replace('enchant_','')+" is invalid.", el, true);
            // Give .whoa-error className
            if(!el.hasClass('whoa-error')) {
              el.addClass(" whoa-error");
            }
            $('error-email-message').css("display","block");
            errors.push(el);
          }
        }
      }
    });
    
  });

  // Set Listeners
  $('.whoa-error').each(function(error,i) {
    error.on('focus', function(e) {
      this.removeClass('whoa-error');
    }, false);
  });

  // return
  
  if(errors.length > 0) {
    return false;
  } else {
    return true;
  }
}
