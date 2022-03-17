from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

def send_message(to_email, subject, message):
    msg = MIMEMultipart()    
    password = "testPassword.111"
    msg['From'] = "python.app159@gmail.com"
    msg['To'] = to_email
    msg['Subject'] = subject
    
    msg.attach(MIMEText(message, 'plain'))

    
    server = smtplib.SMTP_SSL('smtp.gmail.com: 465')
    server.login(msg['From'], password)
    server.sendmail(msg['From'], msg['To'], msg.as_string().encode('utf-8'))
    server.quit()