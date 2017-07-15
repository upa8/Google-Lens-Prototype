"use strict";

Webcam.set({
    width: 320,
    height: 240,
    dest_width: 640,
    dest_height: 480,
    image_format: 'jpeg',
    jpeg_quality: 90
});
Webcam.attach( '#my_camera' );

function take_snapshot() {
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
    app.models.predict(Clarifai.GENERAL_MODEL, {base64: image}).then(
        function(response) {
            var result = "<ul>";
            for(var i =0; i< 5; i++){
                result += '<li>' +response.outputs[0].data.concepts[i].name +" probability "+ response.outputs[0].data.concepts[i].value +'<li>';
            }
            result +="</ul>"
            document.getElementById('results').innerHTML = result;
        },
        function(err) {
            console.log('Error');
        }
    );
}
