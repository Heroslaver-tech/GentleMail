from flask import Flask, render_template

app = Flask(__name__)

# Ruta para servir el HTML principal
@app.route('/')
def index():
    return render_template('voz_a_texto.html')

if __name__ == '__main__':
    app.run(debug=True)
