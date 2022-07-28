// YOUR JAVASCRIPT CODE FOR INDEX.HTML GOES HERE




function Fetch(){
    fetch("https://webgl-774013556.development.catalystserverless.com/server/web_gl_function/")
    .then(response => response.json())
    .then(data => {

        console.log(data);
        document.getElementById("display").textContent= data;
            fetch(data)
            .then(res => {
                console.log(res.json())
                window.open(res.json().data, "self");
            });
    });
}