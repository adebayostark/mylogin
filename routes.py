from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def operator():
    return render_template('companyLogin.html')

if __name__ == "__main__":
    app.run(debug=True)