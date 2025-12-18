    (function () {
        'use strict'
        const mailConfig = {
            apiKey: '3|D6arSWSqc03QEVLWBjToz6foneCUUNm3cyWMADKu',
            apiUrl: 'https://api1.whoamapi.com/api/lead/intake'
        }
        $.ajaxSetup({
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                'Allowance': 'key',
                'Authorization': 'Bearer ' + mailConfig.apiKey,
            }
        });

        $('form[data-list-id]').on('submit', function (e) {
            e.preventDefault();
            let form = $(this),
                list_id = form.data('list-id'),
                form_title = form.data('form-title'),
                email_field = form.find('input[type=email]'),
                submit_btn = form.find('input[type=submit]');
          
                form.addClass('was-validated');
                submit_btn.addClass('disabled').attr('disabled', 'disabled');

            const regex = /^(([^<>()[\]{}'^?\\.,!|\/\/#%*-+=&;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            
          if (email_field.val().length < 5) {
                throwError('Please provide a valid email.', email_field); 
            } else if (regex.test(email_field.val()) == false) {
                throwError('Invalid email address..', email_field);  
            }

          
            if (!form[0].checkValidity()) {
                submit_btn.removeClass('disabled').removeAttr('disabled');
                return;
            }

            $.ajax({
                method: 'POST',
                url: mailConfig.apiUrl,
                data: JSON.stringify({
                    email: email_field.val(),
                    form_title: form_title,
                    list_id: list_id
                })
            }).always(function (jqXHR, statusTxt, statusCode) {
                submit_btn.removeClass('disabled').removeAttr('disabled');
                switch (statusCode.status) {
                    case 200:
                    case 201:
                        throwSuccess("You've been added to our list!", email_field);
                        break;
                    case 400:
                    case 422:
                        switch (jqXHR.title.toLowerCase()) {
                            case "invalid resource":
                                throwError("Invalid email address", email_field);
                                break;
                            case "member exists":
                                throwError("Email already subscribed!", email_field);
                                break;
                            default:
                                throwError("There was a problem adding you to the list, please try again later.", email_field);
                        }
                        break;
                  default:
                    throwError("There was a problem adding you to the list, please try again later.", email_field);
                    break;
                    
                }
            }).fail(function() {
              submit_btn.removeClass('disabled').removeAttr('disabled');
              throwError("There was a problem adding you to the list, please try again later.", email_field);
            });

            return false;
        });
      
      function throwError(msg, field)
      {
        field.val('');
        let oldAttr = field.attr('placeholder');
        field.addClass('error').attr('placeholder', msg);
        field.on('focus', function() {
          $(this).removeClass('error').attr('placeholder', oldAttr);
        })
      }
      
      function throwSuccess(msg, field)
      {
        field.val('');
        let oldAttr = field.attr('placeholder');
        field.addClass('success').attr('placeholder', msg);
        field.on('focus', function() {
          $(this).removeClass('success').attr('placeholder', oldAttr);
        })
      }
        
    })()