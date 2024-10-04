from flask import Flask, render_template, request

app = Flask(__name__)

# Ruta para servir el HTML principal
@app.route('/')
def index():
    return render_template('voz_a_texto.html')

@app.route('/procesamiento')
def procesamiento():
    return render_template('informal_a_formal.html')

@app.route('/mensaje')
def mensaje():
    message = request.args.get('text', 'No hay mensaje')
    return render_template('texto_a_voz.html', message=message)

if __name__ == '__main__':
    app.run(debug=True)
