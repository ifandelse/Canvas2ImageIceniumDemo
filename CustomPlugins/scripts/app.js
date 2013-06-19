var app = (function() {
    'use strict';
    
    // global error handling
    var showAlert = function(message, title, callback) {
        navigator.notification.alert(message, callback || function () {
        }, title, 'OK');
    };
    var showError = function(message) {
        showAlert(message, 'Error occured');
    };
    window.addEventListener('error', function (e) {
        e.preventDefault();
        var message = e.message + "' from " + e.filename + ":" + e.lineno;
        showAlert(message, 'Error occured');
        return true;
    });

    var onBackKeyDown = function(e) {
        e.preventDefault();
        navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
            var exit = function () {
                navigator.app.exitApp();
            };
            if (confirmed === true || confirmed === 1) {
                AppHelper.logout().then(exit, exit);
            }
        }, 'Exit', 'Ok,Cancel');
    };
    var onDeviceReady = function() {
        document.addEventListener("backbutton", onBackKeyDown, false);
    };

    document.addEventListener("deviceready", onDeviceReady, false);

    var mobileApp = new kendo.mobile.Application(document.body, { transition: 'slide', layout: 'mobile-tabstrip' });
    
    var photoViewModel = (function() {
        var cache = {};
        var img = new Image();
        var fileReader = new FileReader();
        var $photo;
        var wired = false;
        
        fileReader.onload = function (e) {
            img.src = e.target.result;
        };
        
        return { 
            
            caption: '',
            
            textColor: 'black',
            
            picSelected: false,
            
            drawImage: function() {
                if(!this.get('picSelected')) {
                   return;
                }
                
                var rw = img.width  / cache.canvas.width;
                var rh = img.height / cache.canvas.height;
                var newh = 0;
                var neww = 0;
                
                if (rw > rh) {
                    newh = Math.round(img.height / rw);
                    neww = cache.canvas.width;
                } else {
                    neww = Math.round(img.width / rh);
                    newh = cache.canvas.height;
                }
                
                cache.canvas.width = cache.canvas.width;
                
                if(!wired) {
                    img.onload = this.drawImage.bind(this); 
                    wired = true;
                }
                
                if (img.width) {
                    cache.context.drawImage(
                        img,
                        (cache.canvas.width  - neww) / 2,
                        (cache.canvas.height - newh) / 2,
                        neww,
                        newh
                    );
                }
                
                cache.context.font = 'bold 32pt helvetica';
                cache.context.fillStyle = this.get('textColor');
                cache.context.textAlign = 'center';
                cache.context.fillText(this.get('caption'), canvas.width/2, canvas.height-15);
                this.set('previewSrc', canvas.toDataURL());
            },
            
            init: function() {
                cache.canvas  = document.getElementById('canvas');
                cache.context = canvas.getContext('2d');
            },
            
            onAddPic: function() {
                $photo = $photo || $("#photo");
                $photo.click();
            },
            
            onPicSet: function(e) {
                var file = e.target.files[0];  
                fileReader.readAsDataURL(file); 
                this.set('picSelected', true);
                this.set('picName', file.name);
                this.drawImage(this.get('caption'), this.get('textColor'));
            },
            
            onRemovePic: function() {
                this.set("picSelected", false);
                $photo = $photo || $("#photo");
                $photo.replaceWith($photo = $photo.clone(true));
                this.set('previewSrc', undefined);
            },
            
            saveCanvasToImage: function (e) {
                e.preventDefault();
                var canvas2ImagePlugin = window.plugins.canvas2ImagePlugin;
                canvas2ImagePlugin.saveImageDataToLibrary(
                    function(msg){
                        navigator.notification.alert(msg);
                    }, 
                    function(err){
                        navigator.notification.alert(err);
                    }, 
                    'canvas'
                );
            }
        };
        
    }());
    
    return {
        viewModels: {
            photo: photoViewModel    
        }
    };
    
}());