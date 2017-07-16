var app = angular.module('app', ['ngAnimate']);
app.controller('homeController', function($scope) {
    startWebcam();
    startSpeechRecognition();
    loading(false);
    $scope.takeSnapshot = function () {
        takeSnapshot();
    }

    function startWebcam() {
        Webcam.set({
            width: 320,
            height: 240,
            dest_width: 640,
            dest_height: 480,
            image_format: 'jpeg',
            jpeg_quality: 90
        });
        Webcam.attach( '#my_camera' );
    }
    
    function startSpeechRecognition() {
        // Add speech recognition
        if (annyang) {
            var commands = {
                'who am I': function() {
                    takeSnapshot();
                }
            };

            // Add our commands to annyang
            annyang.addCommands(commands);
            annyang.start();
        }else{
            console.log('error');
        }
    }
    
    function loading(value) {
        $scope.loading = value;
    }
    function takeSnapshot() {
        loading(true);
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
                var result = "";
                var dataLength = response.outputs[0].data.regions[0].data.face.identity.concepts.length;
                var data = response.outputs[0].data.regions[0].data.face.identity.concepts;
                for(var i =0; i< dataLength; i++){
                    result += '<h4>' +data[i].name +" probability "+ data[i].value +'</h4>';
                }
                result +="";
                $scope.$apply(loading(false))
                document.getElementById('results').innerHTML = result;
            },
            function(err) {
                document.getElementById('results').innerHTML = "Error in finding the results";
                $scope.$apply(loading(false))
            }
        );
    }
});