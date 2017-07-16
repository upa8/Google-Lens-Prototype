var app = angular.module('app', ['ngAnimate']);
app.controller('homeController', function($scope) {
    console.log('Testing');

    $scope.take_snapshot = function () {
        console.log('I am clicker');
    }

    Webcam.set({
        width: 320,
        height: 240,
        dest_width: 640,
        dest_height: 480,
        image_format: 'jpeg',
        jpeg_quality: 90
    });
    Webcam.attach( '#my_camera' );

    if (annyang) {
        console.log('Hi')
        // Let's define our first command. First the text we expect, and then the function it should call
        var commands = {
            'who am I': function() {
                take_snapshot();
            }
        };

        // Add our commands to annyang
        annyang.addCommands(commands);

        // Start listening. You can call this here, or attach this call to an event, button, etc.
        annyang.start();
    }else{
        console.log('error');
    }


    function take_snapshot() {
        console.log('Tesing')
        // take snapshot and get image data
        Webcam.snap( function(data_uri) {
            var base64ImageData = data_uri.replace(/^data:image\/(.*);base64,/, '');
            findObject(base64ImageData);
        } );
    }

    function findObject(image) {
        const app = new Clarifai.App({
            apiKey: 'ec678ed6f34d47f49f2d144fd1fad086'
        });

        // celebrity - e466caa0619f444ab97497640cefc4dc // Clarifai.GENERAL_MODEL
        app.models.predict("e466caa0619f444ab97497640cefc4dc", {base64: image}).then(
            function(response) {
                var result = "<ul>";
                var dataLength = response.outputs[0].data.regions[0].data.face.identity.concepts.length;
                var data = response.outputs[0].data.regions[0].data.face.identity.concepts;
                for(var i =0; i< dataLength; i++){
                    result += '<li>' +data[i].name +" probability "+ data[i].value +'<li>';
                }
                result +="</ul>"
                document.getElementById('results').innerHTML = result;
            },
            function(err) {
                console.log('Error');
            }
        );
    }



});