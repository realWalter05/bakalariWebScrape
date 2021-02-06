import requests
from bs4 import BeautifulSoup
import json
from flask import Flask, render_template
from itertools import groupby


app = Flask(__name__)
s = requests.session()

def main():
    @app.route('/')
    def index():
        return render_template('index.html', msgs="Hello world!")
