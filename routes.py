from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def load_user():
    return render_template('companyLogin.html')

@app.route('/us/authwall')
def load_staff():
    return render_template('staffLogin.html')

if __name__ == "__main__":
    app.run(debug=True)
