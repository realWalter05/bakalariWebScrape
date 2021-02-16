function OpenMsg(msg) {
    var body = document.body;
    var msgBox = document.createElement("section")
    var header = document.createElement("div")
    // Defining elements of msg dictionary
    var msgDiv = document.createElement("div")
    var timeDiv = document.createElement("div")
    var nameDiv = document.createElement("div")
    var filesDiv = document.createElement("div")


    var close = document.createElement("div");

    // If body already has msg box
    if(!body.contains(document.querySelector(".msg_box"))) {
        // Setting up elements of msg dictionary
        msgDiv.innerHTML = msg["MessageText"];
        timeDiv.innerHTML = msg["Cas"];
        nameDiv.innerHTML = msg["Jmeno"];
        if(msg["Files"]) {
            msg["Files"].forEach(function(file) {
                var fileA = document.createElement("a");
                fileA.setAttribute("href", "https://zsebenese.bakalari.cz/next/getFile.aspx?f=" + file["id"]);
                fileA.setAttribute("target", "_blank");
                fileA.innerHTML = file["name"] + "<br/>";

                filesDiv.appendChild(fileA);
            });
        }


        close.setAttribute("onclick", "CloseMsg()");
        close.setAttribute("class", "close_div");
        msgDiv.setAttribute("class", "msg_div");
        timeDiv.setAttribute("class", "time_div");
        nameDiv.setAttribute("class", "name_div");
        filesDiv.setAttribute("class", "files_div");

        header.setAttribute("class", "msg_box_header");
        header.appendChild(timeDiv);
        header.appendChild(nameDiv);

        msgBox.setAttribute("class", "msg_box");
        msgBox.appendChild(header);
        msgBox.appendChild(msgDiv);
        msgBox.appendChild(filesDiv);
        msgBox.appendChild(close);

        body.appendChild(msgBox);
    } else {
        var msgDiv = document.querySelector(".msg_div");
        var timeDiv = document.querySelector(".time_div");
        var nameDiv = document.querySelector(".name_div");
        var filesDiv = document.querySelector(".files_div");

        msgDiv.innerHTML = msg["MessageText"];
        timeDiv.innerHTML = msg["Cas"];
        nameDiv.innerHTML = msg["Jmeno"];
        filesDiv.innerHTML = "";
        if(msg["Files"]) {
            msg["Files"].forEach(function(file) {
                var fileA = document.createElement("a");
                fileA.setAttribute("href", "https://zsebenese.bakalari.cz/next/getFile.aspx?f=" + file["id"]);
                fileA.setAttribute("target", "_blank");
                fileA.innerHTML = file["name"] + "<br/>";

                filesDiv.appendChild(fileA);
            });
        }
    }
}

function CloseMsg() {
    document.body.removeChild(document.querySelector(".msg_box"));
}

function CheckCookies() {
    if(!document.cookie == "") {
        window.location.replace("http://127.0.0.1:5000/showmsgs/?");
        console.log("There are cookies and showing msgs ")
    } else {
        window.location.replace("http://127.0.0.1:5000/setup/?");
        console.log("There aren't any cookies and redirecting to msgs")
    }
}

function SetCookies(msg) {
    console.log(msg);
}