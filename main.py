import requests
from bs4 import BeautifulSoup
import json
from flask import Flask, render_template
from itertools import groupby


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

    msgs_table = bs.findAll(attrs="needsclick link message_list_table_item message_list_table_read_ano sender_U "
                                  "sender_U_hover message_list_table_repressed_ne")
    ids_msg = []
    for msg in msgs_table:
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

        msg_dict = {
            "MessageText": "" + str(msg),
            "Jmeno": "" + name.get_text(),
            "Cas": "" + time.get_text(),
        }
        msgs.append(msg_dict)
    return msgs


def group_msgs(msgs):
    msgs = groupby(msgs, key=lambda k: k['Jmeno'])

    big_list = []
    for key, value in msgs:
        print("This is key: " + key)
        if key == "Mgr. Andrea Slabá" or key == "Mgr. Jan Koutník" or key == "Mgr. Jaroslav Chval" or key == "Mgr. Lucie Zemanová":
            continue
        lis = []
        for k in value:
            lis.append(k)
            print(k)
        big_list.append(lis)
    return big_list


def main():
    payload = {
        "username": "zikav29z",
        "password": "1c2zkH51",
        "returnUrl": "/dashboard",
        "login": "",
    }
    page_komens = send_payload("https://zsebenese.bakalari.cz/Login", "https://zsebenese.bakalari.cz/next/komens.aspx?s=rok",
                               payload)

    msgs = get_msgs(get_idmsg(page_komens))

    msgs = group_msgs(sorted(msgs, key=lambda k: k['Jmeno']))

    @app.route('/')
    def index():
        return render_template('index.html', msgs=msgs)
    app.run(debug=True)


if __name__ == '__main__':
    main()