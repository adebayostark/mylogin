from flask import Flask, render_template, request, session, url_for, redirect
from models import db, User, Admin
from forms import UserLogin, AdminLogin
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:zysodadmin@localhost:5432/mysites'
db.init_app(app)
app.secret_key = "development_key"
@app.route('/', methods=['GET','POST'])
def load_user():
    form = UserLogin()
    if request.method == 'POST':
        if form.validate() == True:
            ID = form.companyID.data
            user = User.query.filter_by(company_id=ID).first()
            if user is not None:
                session['company_id'] =  form.companyID.data
                name = user.company_name
                print(name)
                return redirect(url_for('load_pop'))
            else:
                return render_template('companyLogin.html',form=form)
    return render_template('companyLogin.html',form=form)

@app.route('/us/authwall', methods=['GET', 'POST'])
def load_staff():
    if 'email' in session:
        return redirect(url_for('load_pop'))
    # if 'company_id' in session:
    #     return redirect(url_for('load_pop'))
    form = AdminLogin()
    if request.method == 'POST':
        if form.validate() == True:
            email =  form.email.data
            password = form.password.data
            user = Admin.query.filter_by(email=email).first()
            if user is not None:
                session['email'] = form.email.data                
                return redirect(url_for('load_pop'))
            else:
                return render_template('staffLogin.html',form=form)
    return render_template('staffLogin.html',form=form)

@app.route('/home')
def load_pop():
    if 'email' not in session:
        return redirect(url_for('load_staff'))
    if 'company_id' not in session:
        return redirect(url_for('load_user'))
    return render_template('popup.html')

@app.route('/auth/logout')
def admin_logout():
    session.pop('email', None)
    session.pop('company_id',None)
    return redirect(url_for('load_user'))
if __name__ == "__main__":
    app.run(host="localhost", port=8001, debug=True)
