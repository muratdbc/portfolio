function imagePopup(){
            var modal = document.getElementById('myModal');
            var img = document.getElementById(event.target.getAttribute("id"));
            var modalImg = document.getElementById("img01");
            var captionText = document.getElementById("caption");
            modal.style.display = "block";
            modalImg.src = img.src;
            captionText.innerHTML = img.alt;
            var span = document.getElementsByClassName("close")[0];
            span.onclick = function() {
                modal.style.display = "none";
            }
 }