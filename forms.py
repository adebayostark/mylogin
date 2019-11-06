from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length, Email
class UserLogin(FlaskForm):
    companyID = StringField('Company ID', validators=[DataRequired('Please enter company ID'), Length(max=8, min=8, message='ID must be an 8-digit ID')])
    submit = SubmitField('AFFILIATE')

class AdminLogin(FlaskForm):
    email = StringField('Email', validators=[DataRequired('Please enter the email'), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('AFFILIATE')