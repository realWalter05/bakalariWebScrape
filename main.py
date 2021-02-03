from flask import Flask, render_template

app = Flask(__name__)

if __name__ == '__main__':
    @app.route('/')
    def index():
        return render_template('index.html', s="?!?Hello World?!?")
    app.run(debug=True)
