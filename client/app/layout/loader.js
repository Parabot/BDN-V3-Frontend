(function () {
    $(window).load(function () {
        setTimeout(hideLoader, 0)
    });

    function hideLoader() {
        $('#loader-container').fadeOut("slow")
    }
})(); 
