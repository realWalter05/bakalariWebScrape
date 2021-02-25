function OpenMsg(msg) {
    var body = document.body;
    var msgBox = document.createElement("section")
    var header = document.createElement("div")
    // Defining elements of msg dictionary
    var msgDiv = document.createElement("div")
    var timeDiv = document.createElement("div")
    var nameDiv = document.createElement("div")
    var filesDiv = document.createElement("div")

    var closeDiv = document.createElement("div");
    var close = document.createElement("img");

    // If body already has msg box
    if(!body.contains(document.querySelector(".msg_box"))) {
        // Setting up elements of msg dictionary
        msgDiv.innerHTML = msg["MessageText"];
        timeDiv.innerHTML = "<i>"+msg["Cas"]+"</i>";
        nameDiv.innerHTML = "<i>"+msg["Jmeno"]+"</i>";
        if(msg["Files"]) {
            msg["Files"].forEach(function(file) {
                var fileA = document.createElement("a");
                fileA.setAttribute("href", "https://zsebenese.bakalari.cz/next/getFile.aspx?f=" + file["id"]);
                fileA.setAttribute("target", "_blank");
                fileA.innerHTML = file["name"] + "<br/>";

                filesDiv.appendChild(fileA);
            });
        }

        closeDiv.setAttribute("class", "close_div");
        close.setAttribute("class", "close");
        close.setAttribute("onclick", "CloseMsg()");
        close.setAttribute("src", "/static/img/arrow_top.png");
        msgDiv.setAttribute("class", "msg_div");
        timeDiv.setAttribute("class", "time_div");
        nameDiv.setAttribute("class", "name_div");
        filesDiv.setAttribute("class", "files_div");

        closeDiv.appendChild(close);

        header.setAttribute("class", "msg_box_header");
        header.appendChild(timeDiv);
        header.appendChild(nameDiv);

        msgBox.setAttribute("class", "msg_box");
        msgBox.appendChild(header);
        msgBox.appendChild(msgDiv);
        msgBox.appendChild(filesDiv);
        msgBox.appendChild(closeDiv);

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

function CheckLocalStorage() {
    if(!localStorage.getItem("msgs") == "") {
        LoadPageByJs();
    } else {
        window.location.replace("http://127.0.0.1:5000/get_msgs/");
    }
}

function SetLocalStorage(msgs) {
    localStorage.setItem("msgs", JSON.stringify(msgs));
}

function LoadPageByJs() {
    var msgs = JSON.parse(localStorage.getItem("msgs"));
    var divMsgs = document.querySelector(".msgs")

    msgs.forEach(function(key) {
        var keyDiv = document.createElement("div");
        keyDiv.setAttribute("class", "key_div")

        var h2 = document.createElement("h2");
        h2.setAttribute("class", "key_name");
        h2.innerHTML = key[0]["Jmeno"];

        var keyUl = document.createElement("ul");
        keyUl.setAttribute("class", "key")
        key.forEach(function(msg) {
            var li = document.createElement("li");
            li.setAttribute("class", "msg");
            li.setAttribute("id", "msg");
            li.setAttribute("onclick", "OpenMsg("+JSON.stringify(msg)+");");

            var p = document.createElement("p");

            var msgHeader = document.createElement("ul")
            msgHeader.setAttribute("class", "msg_header");

            var CasMsgHeader = document.createElement("li");
            CasMsgHeader.innerHTML = "<i>"+ msg["Cas"] +"</i>";
            var JmenoMsgHeader = document.createElement("li");
            JmenoMsgHeader.innerHTML = "<i>"+ msg["Jmeno"] +"</i>";

            msgHeader.appendChild(CasMsgHeader);
            msgHeader.appendChild(JmenoMsgHeader);

            p.appendChild(msgHeader);
            var MessageText = document.createElement("p");
            MessageText.innerHTML = msg["MessageText"];
            p.appendChild(MessageText);

            li.appendChild(p);

            var line = document.createElement("hr");
            line.setAttribute("class", "line");

            keyUl.appendChild(li);
            keyUl.appendChild(line);
        });

        keyDiv.appendChild(h2);
        keyDiv.appendChild(keyUl);
        divMsgs.appendChild(keyDiv);
    });
}

function UpdateMsgs() {
    var msgs = JSON.parse(localStorage.getItem("msgs"));

    var reload_icon = document.querySelector(".reload_icon");
    reload_icon.classList.add("rotate");

    var form = document.createElement("form");
    form.setAttribute("action", "http://127.0.0.1:5000/get_msgs/");
    form.setAttribute("method", "POST");

    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "msgs");
    input.setAttribute("value", msgs);

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
}