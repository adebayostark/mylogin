from flask_sqlalchemy import SQLAlchemy
from werkzeug import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    uid = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(100))
    company_id = db.Column(db.String(8), unique=True)

    def __init__(self, company_name, company_id):
        self.company_name.title()
        self.company_id

class Admin(db.Model):
    __tablename__ = 'admin'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))

    def __init__(self, email, hashpassword):
        self.email = email.lower()
        self.set_password(hashpassword)
    
    def set_password(self, hashpassword):
        self.password = generate_password_hash(hashpassword)
    def check_password(self, hashpassword):
        return check_password_hash(self.password, hashpassword)