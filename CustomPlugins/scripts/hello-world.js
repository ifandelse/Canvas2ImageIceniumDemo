var viewModel = kendo.observable({
    pressureData: [
        {val:936}, {val:968}, {val:1025}, {val:999}, {val:998}, {val:1014}, {val:1017}, {val:1010}, {val:1010}, {val:1007}, {val:1004}, {val:988}, {val:990}, {val:988}, {val:987}, {val:995}, {val:946}, {val:954}, {val:991}, {val:984}, {val:974}, {val:956}, {val:986}, {val:936}, {val:955}, {val:1021}, {val:1013}, {val:1005}, {val:958}, {val:953}        
    ]
    ,
    temperatureData: [
        {val:16}, {val:17}, {val:18}, {val:19}, {val:20}, {val:21}, {val:21}, {val:22}, {val:23}, {val:22},
        {val:20}, {val:18}, {val:17}, {val:17}, {val:16}, {val:16}, {val:17}, {val:18}, {val:19}, {val:20},
        {val:21}, {val:22}, {val:23}, {val:25}, {val:24}, {val:24}, {val:22}, {val:22}, {val:23}, {val:22}
    ],
  
    humidityData: [
        {val:71}, {val:70}, {val:69}, {val:68}, {val:65}, {val:60}, {val:55}, {val:55}, {val:50}, {val:52},
        {val:73}, {val:72}, {val:72}, {val:71}, {val:68}, {val:63}, {val:57}, {val:58}, {val:53}, {val:55},
        {val:63}, {val:59}, {val:61}, {val:64}, {val:58}, {val:53}, {val:48}, {val:48}, {val:45}, {val:45}
    ],
  
    temperatureRange: [{val:21, t:5}],
  
    monday:[{val:14}, {val:10}],
    tuesday:[{val:8}, {val:16}],
    wednesday:[{val:8}, {val:16}],
    thursday:[{val:12}, {val:12}],
    friday:[{val:6}, {val:18}],
    saturday:[{val:1}, {val:19}],
    sunday:[{val:5}, {val:19}]
});    

document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
    var app = new kendo.mobile.Application(document.body, { transition: "slide", layout: "mobile-tabstrip" });
}

function supportsSvg() {
    return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGPoint;
}

function onViewInitialized() {
    if (!supportsSvg()) {
        var widgets = $("[data-role='sparkline'],[data-role='chart']", this.element);
        convertSvgToCanvas(widgets);
    }
}

function convertSvgToCanvas(widgets) {
    for (var i = 0; i < widgets.length; i++) {
        var widgetElem = $(widgets[i]);
        var widget = widgetElem.data("kendoChart") || widgetElem.data("kendoSparkline");

        svg = widget.svg();
        var canvas = document.createElement("canvas");
        canvas.setAttribute("style", "height:" + widgetElem.height() + ";width:" + widgetElem.width() + ";");
        
        //Convert the SVG to canvas
        canvg(canvas, svg);

        //Remove the SVG/VML and show the canvas rendering
        widgetElem.empty();
        widgetElem.append(canvas);
    }
}            
