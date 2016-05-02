/**
 *
 * @param event
 * @param selected
 * @returns {boolean}
 */
function newImage(event, selected){
    var formData = new FormData($('form')[0]);
    $.ajax({
        url: '/myImages',
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData
    }).success(function(data, status){
        console.log(status);
    });
    event.preventDefault();
    return false;
}

/**
 *
 */
function previewImage(selected){
    var sel = $(selected);
    var oFReader = new FileReader();
    //console.log($(selected)[0].files[0]);
    oFReader.readAsDataURL(sel[0].files[0]);

    oFReader.onload = function (oFREvent) {
        $("#file_upload_preview").attr("src", oFREvent.target.result);
    };
}