function OpenMsg(msg) {
    var body = document.body;
    var msgBox = document.createElement("section")
    var header = document.createElement("div")
    // Defining elements of msg dictionary
    var msgDiv = document.createElement("div")
    var timeDiv = document.createElement("div")
    var statusDiv = document.createElement("div")
    var filesDiv = document.createElement("div")

    var closeDiv = document.createElement("div");
    var close = document.createElement("img");

    // If body already has msg box
    if(!body.contains(document.querySelector(".msg_box"))) {
        // Setting up elements of msg dictionary
        msgDiv.innerHTML = msg["MessageText"];
        timeDiv.innerHTML = "<i>"+msg["Cas"]+"</i>";

        statusDiv.innerHTML = "<img src='/static/img/no_time.svg' onclick='SetMsgStatus(&quot;"+ msg['idmsg'] +"&quot;,&quot;"+ "no_time" +"&quot;)' class='status_icon margin' alt='No time'/><img src='/static/img/working_on.png' onclick='SetMsgStatus(&quot;"+ msg['idmsg'] +"&quot;,&quot;"+ "working_on" +"&quot;)' class='status_icon margin' alt='Working on'/><img src='/static/img/done.png' onclick='SetMsgStatus(&quot;"+ msg['idmsg'] +"&quot;,&quot;"+ "done" +"&quot;)' class='status_icon margin' alt='Done'/>";
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
        statusDiv.setAttribute("class", "status_div");
        filesDiv.setAttribute("class", "files_div");

        closeDiv.appendChild(close);

        header.setAttribute("class", "msg_box_header");
        header.appendChild(timeDiv);
        header.appendChild(statusDiv);

        msgBox.setAttribute("class", "msg_box");
        msgBox.appendChild(header);
        msgBox.appendChild(msgDiv);
        msgBox.appendChild(filesDiv);
        msgBox.appendChild(closeDiv);

        body.appendChild(msgBox);
    } else {
        var msgDiv = document.querySelector(".msg_div");
        var timeDiv = document.querySelector(".time_div");
        var statusDiv = document.querySelector(".status_div");
        var filesDiv = document.querySelector(".files_div");

        msgDiv.innerHTML = msg["MessageText"];
        timeDiv.innerHTML = msg["Cas"];
        statusDiv.innerHTML = "<img src='/static/img/no_time.svg' onclick='SetMsgStatus(&quot;"+ msg['idmsg'] +"&quot;,&quot;"+ "no_time" +"&quot;)' class='status_icon margin' alt='No time'/><img src='/static/img/working_on.png' onclick='SetMsgStatus(&quot;"+ msg['idmsg'] +"&quot;,&quot;"+ "working_on" +"&quot;)' class='status_icon margin' alt='Working on'/><img src='/static/img/done.png' onclick='SetMsgStatus(&quot;"+ msg['idmsg'] +"&quot;,&quot;"+ "done" +"&quot;)' class='status_icon margin' alt='Done'/>";
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

    document.querySelector(".msgs").classList.add("blur");

    var click = document.createElement("div");
    click.setAttribute("class", "dark");
    click.setAttribute("onclick", "CloseMsg();");
    document.body.appendChild(click);


}

function CloseMsg() {
    console.log("closing");
    document.body.removeChild(document.querySelector(".dark"));
    document.querySelector(".msgs").classList.remove("blur");
    document.body.removeChild(document.querySelector(".msg_box"));
    document.querySelector(".msgs").removeAttribute("onclick", "CloseMsg()");
}

function CheckLocalStorage() {
    if(!localStorage.getItem("msgs") == "") {
        LoadPageByJs();
    } else {
     // window.location.replace("http://127.0.0.1:5000/get_msgs/");
        window.location.replace("https://banakmis.herokuapp.com/get_msgs/");
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
            li.setAttribute("idmsg", msg["idmsg"]);
            li.setAttribute("onclick", "OpenMsg("+JSON.stringify(msg)+");");

            var p = document.createElement("p");

            var msgHeader = document.createElement("ul")
            msgHeader.setAttribute("class", "msg_header");

            var casMsgHeader = document.createElement("li");
            casMsgHeader.innerHTML = "<i>"+ msg["Cas"] +"</i>";
            var statusMsgHeader = document.createElement("li");
            statusMsgHeader.setAttribute("class", "status_msg_header");
            statusMsgHeader.innerHTML = InStorage(msg);

            msgHeader.appendChild(casMsgHeader);
            msgHeader.appendChild(statusMsgHeader);

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

function InStorage(msg) {
    var statuses = localStorage.getItem("statuses");

    if(statuses == null) {
        return msg["Jmeno"];
    }

    var array = JSON.parse(statuses);
    var status;
    array.some(function(key) {
        if(key["msgid"] == msg["idmsg"]) {
            switch(key["status"]){
                case "no_time":
                    status = "<img src='/static/img/no_time.svg' class='status_icon margin' alt='No time'/>";
                    break;
                case "working_on":
                    status = "<img src='/static/img/working_on.png' class='status_icon margin' alt='Working on'/>";

                    break;
                case "done":
                    status = "<img src='/static/img/done.png' class='status_icon margin' alt='Done'/>";
                    break;
            }
            return true;
        }
        status = msg["Jmeno"];
    });
    return status;
}

function UpdateMsgs() {
    var msgs = JSON.parse(localStorage.getItem("msgs"));

    var reload_icon = document.querySelector(".reload_icon");
    reload_icon.classList.add("rotate");

    var form = document.createElement("form");
 // form.setAttribute("action", "http://127.0.0.1:5000/get_msgs/");
    form.setAttribute("action", "https://banakmis.herokuapp.com/get_msgs/");
    form.setAttribute("method", "POST");

    var input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("name", "msgs");
    input.setAttribute("value", msgs);

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
}

function SetMsgStatus(msgid, status) {
    console.log(msgid);

    var currentMsg = document.querySelector("[idmsg='" + msgid + "']");
    var status_img = "";
    switch(status){
      case "no_time":
          status_img = "<img src='/static/img/no_time.svg' class='status_icon margin' alt='No time'/>";
          break;
      case "working_on":
          status_img = "<img src='/static/img/working_on.png' class='status_icon margin' alt='Working on'/>";
          break;
      case "done":
          status_img = "<img src='/static/img/done.png' class='status_icon margin' alt='Done'/>";
          break;
    }
    currentMsg.querySelector(".status_msg_header").innerHTML = status_img;

    var statuses = localStorage.getItem("statuses");

    var statusArray = [];
    var entry = {
        "msgid": msgid,
        "status": status,
    }

    statusArray.push(entry);
    if(statuses == null) {
        console.log("No statuses");
        localStorage.setItem("statuses", JSON.stringify(statusArray));
    } else {
        var array = JSON.parse(statuses);
        var counter = 0;
        array.forEach(function(key) {
            if(key["msgid"] == msgid) {
                console.log("already here");
                key["status"] = status;
                console.log("status: " + key);
                counter++;
                localStorage.setItem("statuses", JSON.stringify(array));
            }
        });
        if(counter == 0) {
            console.log("status wasn t there yet");
            array.push(entry);
            localStorage.setItem("statuses", JSON.stringify(array));
        }
    }
}