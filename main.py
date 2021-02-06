from flask import Flask, render_template


app = Flask(__name__)
s = requests.session()

def main():
    @app.route('/')
    def index():
        return render_template('index.html', msgs="Hello world!")
