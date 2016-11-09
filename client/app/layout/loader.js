(function () {
    $(window).load(function () {
        setTimeout(hideLoader, 1500)
    });

    function hideLoader() {
        $('#loader-container').fadeOut("slow")
    }
})(); 
