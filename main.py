import requests
from bs4 import BeautifulSoup
import json
from requests import session
from flask import Flask, render_template, request
from itertools import groupby
from datetime import date
from dateutil.relativedelta import relativedelta

app = Flask(__name__)
s = requests.session()


def send_payload(from_url, to_url, data_payload):
    s.post(from_url, data=data_payload)
    page = s.get(to_url)

    if not page.ok:
        print(f"Payload {from_url} to {to_url} error! Status code of page: {page.status_code}")
    return page


def get_idmsg(url):
    bs = BeautifulSoup(url.content, 'html.parser')

    msgs_table = bs.findAll(attrs="message_list_table_item")
    ids_msg = []
    for msg in msgs_table:
        print(msg)
        ids_msg.append(msg['data-idmsg'])

    return ids_msg


def get_new_idmsgs(url, old_idmsgs):
    bs = BeautifulSoup(url.content, 'html.parser')

    msgs_table = bs.findAll(attrs="message_list_table_item")

    ids_msg = []
    for msg in msgs_table:
        msg_header = msg.find(attrs="message_list_header")
        msg_name = msg_header.findAll("div")[1].text
        if msg_name == "Mgr. Andrea Slabá" or msg_name == "Mgr. Jan Koutník" or msg_name == "Mgr. Jaroslav Chval" \
                or msg_name == "Mgr. Lucie Zemanová" or msg_name == "Mgr. Aneta Marková" or msg_name == "Mgr. Iva Ťupová" \
                or msg_name == "Mgr. Josef Beniska" or msg_name == "system message" or msg_name == "Mgr. Veronika Pauknerová":
            continue

        if any(dict["idmsg"] == msg['data-idmsg'] for key in old_idmsgs for dict in key):
             break
        else:
            ids_msg.append(msg['data-idmsg'])

    return ids_msg


def get_msgs(ids_msg):
    msgs = []
    for idmsg in ids_msg:
        payload = {
            'idmsg': '' + idmsg,
            'context': 'prijate'
        }
        headers = {
            'Connection': 'keep-alive',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
            'sec-ch-ua': '^\\^Google',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'X-Requested-With': 'XMLHttpRequest',
            'sec-ch-ua-mobile': '?0',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
            'Content-Type': 'application/json; charset=UTF-8',
            'Origin': 'https://zsebenese.bakalari.cz',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'Referer': 'https://zsebenese.bakalari.cz/next/komens.aspx',
            'Accept-Language': 'en,cs;q=0.9,cs-CZ;q=0.8,sk;q=0.7',
        }

        response = s.post('https://zsebenese.bakalari.cz/next/komens.aspx/GetMessageData', headers=headers,
                          data=json.dumps(payload)).json()

        msg = BeautifulSoup(response["MessageText"], 'html.parser')
        name = BeautifulSoup(response["Jmeno"], 'html.parser')
        time = BeautifulSoup(response["Cas"], 'html.parser')
        files = response["Files"]
        idmsg = response["Id"]

        msg_dict = {
            "MessageText": "" + str(msg),
            "Jmeno": "" + name.get_text(),
            "Cas": "" + time.get_text(),
            "Files": files,
            "idmsg": idmsg
        }
        msgs.append(msg_dict)
    return msgs


def group_msgs(msgs):
    msgs = groupby(msgs, key=lambda k: k['Jmeno'])
    sachova_index = 9999
    headmastership_index = 9999
    big_list = []
    index = 0
    for key, value in msgs:
        if key == "Mgr. Andrea Slabá" or key == "Mgr. Jan Koutník" or key == "Mgr. Jaroslav Chval" \
                or key == "Mgr. Lucie Zemanová" or key == "Mgr. Aneta Marková" or key == "Mgr. Iva Ťupová" \
                or key == "Mgr. Josef Beniska" or key == "system message" or key == "Mgr. Veronika Pauknerová":
            continue
        if key == "Mgr. Jaroslava Šáchová":
            sachova_index = index
        if key == "headmastership":
            headmastership_index = index
        lis = []
        for k in value:
            lis.append(k)
        big_list.append(lis)
        index += 1
    # Merging Radr a Sachova
    if not sachova_index == 9999 and not headmastership_index == 9999:
        big_list[sachova_index].extend(big_list[headmastership_index])
        big_list.remove(big_list[headmastership_index])
    return big_list


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login', methods=["GET", "POST"])
def index():
    login_username = request.form.get('login')
    login_pwd = request.form.get('pwd')

    pwd = "1c2zkH51"
    session["username"] = "zikav29z"
    session["password"] = pwd.encode('base64', 'strict')
    return render_template('index.html')


@app.route('/get_msgs', methods=["GET", "POST"])
def get_new_msgs():
    old_idmsgs = request.form.get('msgs')

    if session.get("username"):
        if session.get("password"):
            # We're here from index to get a new msgs
            if old_idmsgs:
                old_idmsgs = json.loads(request.form.get('msgs'))
                print("there are data")
                # FUJblahbjwoengpaiungjpfasodngmkoy
                payload = {
                    "username": "zikav29z",
                    "password": "1c2zkH51",
                    "returnUrl": "/dashboard",
                    "login": "",
                }
                page_komens = send_payload("https://zsebenese.bakalari.cz/Login",
                                           "https://zsebenese.bakalari.cz/next/komens.aspx?s=mesic",
                                           payload)

                idmsgs = get_new_idmsgs(page_komens, old_idmsgs)
                if not idmsgs:
                    return render_template('index.html', status=":O")
                else:
                    msgs = get_msgs(idmsgs)
                    # Merging with old_idmsgs

                    for msg in msgs[::-1]:
                        for key in old_idmsgs:
                            if msg["Jmeno"] == key[0]["Jmeno"]:
                                key.insert(0, msg)
                    return render_template('index.html', msgs=old_idmsgs, status=":ú")
            # We're here from index to setup first msgs
            else:
                number = request.args.get("number")
                start_number = 30
                if number:
                    start_number = int(number)

                print("There are no msgs yet")
                payload = {
                    "username": "zikav29z",
                    "password": "1c2zkH51",
                    "returnUrl": "/dashboard",
                    "login": "",
                }

                # Getting msgs separately because request error h12
                half_year_back = date.today() + relativedelta(days=-start_number)
                start_month = str(half_year_back.day) + str(half_year_back.month) + str(half_year_back.year)

                half_year_back_end = half_year_back + relativedelta(days=+5)
                if start_number == 5:
                    half_year_back_end = date.today()

                end_month = str(half_year_back_end.day) + str(half_year_back_end.month) + str(half_year_back_end.year)

                page_komens = send_payload("https://zsebenese.bakalari.cz/Login",
                                           "https://zsebenese.bakalari.cz/next/komens.aspx?s=custom&l=prijate&from="+start_month+"&to="+end_month,
                                           payload)

                msgs = get_msgs(get_idmsg(page_komens))
                msgs = group_msgs(sorted(msgs, key=lambda k: k['Jmeno']))

                if start_number == 5:
                    return render_template('index.html', msgs=msgs, done="done")
                print("leaving")
                return render_template('index.html', msgs=msgs, number=(start_number - 5))
        else:
            return render_template('index.html', login="nonlog")
    else:
        return render_template('index.html', login="nonlog")
