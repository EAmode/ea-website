$(document).ready(function(){
    document.getElementById("on_off").addEventListener("click", on_Off);
    document.getElementById("on_off_2").addEventListener("click", on_Off);
    function on_Off() {
        document.getElementById("on_off").classList.toggle("on");
        document.getElementById("on_off_2").classList.toggle("on");
        document.getElementById("icon_2").classList.toggle("fa-moon");
        document.getElementById("icon_2").classList.toggle("fa-sun");
        document.getElementById("icon").classList.toggle("fa-moon");
        document.getElementById("icon").classList.toggle("fa-sun");
    }
    $('#menu-mobile').on('click', function(){
        $(".menu").slideToggle( "slow", function() {
          });
    })
})
