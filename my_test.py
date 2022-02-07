import requests
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

pos_test = requests.post('http://127.0.0.1:5000/authorization/sign_up', json={"login": "User11",
"password": "111111",
"email": "user11@mail.ru"})

engine = create_engine('sqlite:///info_data_base.db')
engine.connect()
session = Session(bind=engine)
try:
    user_id = -1
    user = session.execute(text('SELECT id FROM users WHERE login="user11"')).fetchall()
    user_id = user[0][0]
except:
    pass
finally:
    session.close()

unpos_test = requests.post('http://127.0.0.1:5000/authorization/sign_up', json={"login": "",
"password": "",
"email": ""})

if pos_test.status_code == 200 and user_id != -1:
    print('Корректно')
else:
    print('Некорректно')
if unpos_test.status_code == 501:
    print('Корректно')
else:
    print('Некорректно')

