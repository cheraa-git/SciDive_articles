from calendar import c
from email import message
import sys
import datetime
# from nis import cat
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, create_engine, DateTime, desc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, Session, backref
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash
import numpy as np
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
from random import randint


a = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
engine = create_engine('sqlite:///info_data_base.db', echo=True)
Base = declarative_base(bind=engine)

class AccountNotFound(Exception):
    '''
    Authentification pair not found in db
    '''

class AccountExists(Exception):
    '''
    Authentification pair already in db
    '''

class SignupLoginError(Exception):
    '''
    Authentification login already in db
    '''

class SignupEmailError(Exception):
    '''
    Authentification email already in db
    '''

class EmptyValuesAreEntered(Exception):
    '''
    Empty values are entered
    '''

class CreateArticleTokenError(Exception):
    '''
    Invalid author token
    '''

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    admin = Column(Boolean, nullable=False, default=False)
    login = Column(String(50), nullable=False, unique=True)
    email = Column(String(254), nullable=False, unique=True)
    password = Column(String(20), nullable=False)
    avatar = Column(String, default='default_avatar.png', nullable=False)
    forgot_code = Column(String(10), nullable=False, unique=False, default=0)
    blog = relationship("Blog", cascade="all, delete-orphan", back_populates="user", uselist=False)
    subscriptions = relationship("Subscriptions", cascade="all, delete-orphan")
    def __str__(self):
        return ' | '.join([str(self.id), self.login])
        
class Blog(Base):
    __tablename__ = 'blog'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    subscriptions = relationship("Subscriptions", cascade="all, delete-orphan")
    articles = relationship("Articles", cascade="all, delete-orphan")
    user = relationship("User", back_populates="blog")
    def __str__(self):
        return ' | '.join([self.id, self.user_id])

class Articles(Base):
    __tablename__ = 'articles'
    id = Column(Integer, primary_key=True)
    blog_id = Column(Integer, ForeignKey('blog.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(150), nullable=False, unique=False)
    image = Column(String, default='peppa.png', nullable=False)
    prev_content = Column(String(160), nullable=False)
    content = Column(String(65000), nullable=False, unique=False)
    # поставил такое ограничение просто так
    category = Column(String(64), nullable=False)
    tags = Column(String(50), nullable=False)
    # будем редактировать ограничение исходя из длины всех тегов
    date = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    # время создания
    views = Column(Integer, default=0, nullable=False)
    blog = relationship("Blog")

class Subscriptions(Base):
    __tablename__ = 'subscriptions'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    blog_id = Column(Integer, ForeignKey('blog.id', ondelete='CASCADE'), nullable=False)
    blog = relationship(Blog)
    user = relationship(User)


Base.metadata.create_all()


def get_most_recent_articles():
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    articles = session.query(Articles).order_by(Articles.date).limit(30).all()
    rez = []
    for i in articles:
        a = {}
        author = session.query(User).get(i.blog.user_id)
        a["id"] = i.id
        a["blog_id"] = i.blog_id
        a["title"] = i.title
        a["image"] = i.image
        a["prev_content"] = i.prev_content
        # a["content"] = i.content
        a["category"] = i.category
        a["tags"] = i.tags
        a["date"] = i.date
        a["views"] = i.views
        a["author"] = {'login': author.login, "avatar": author.avatar}
        rez.append(a)
    session.close()
    return rez

def get_subscriptions(user_id):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    subscriptions = session.query(Subscriptions).filter_by(user_id=user_id)
    session.close()
    return subscriptions

# def get_blog(user_id):
#     engine = create_engine('sqlite:///info_data_base.db', echo=True)
#     session = Session(bind=engine)
#     user = session.query(Blog).get(user_id)
#     session.close()
#     return user

def get_article(article_id):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    article = session.query(Articles).get(article_id)
    blog = session.query(Blog).get(article.blog_id)
    author = session.query(User).get(blog.user_id)
    session.close()
    return article, author

def get_articles_subscriptions(user_id):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    subscription_s = session.query(Subscriptions).filter_by(user_id=user_id).all()
    sub = [i.blog for i in subscription_s]
    sub_s = []
    # for i in sub:
    #     sub_s.append(get_articles_blog(i))
    for i in sub:
        for k in i.articles:
            a = {}
            a["id"] = k.id
            a["blog_id"] = k.blog_id
            a["title"] = k.title
            a["image"] = k.image
            a["prev_content"] = k.prev_content
            # a["content"] = k.content
            a["category"] = k.category
            a["tags"] = k.tags
            a["date"] = k.date
            a["views"] = k.views
            a["author"] = {'login': k.blog.user.login, "avatar": k.blog.user.avatar}
            sub_s.append(a)
    # # print(a)
    session.close()
    return sub_s

def get_articles_blog(login):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    user = session.query(User).filter_by(login=login).first()
    blog = session.query(Blog).filter_by(user_id=user.id).first()
    articles = session.query(Articles).filter_by(blog_id=blog.id).all()
    rez = []
    # for i in blog_articles:
        # articles.append(session.query(Articles).get(i.id))
    for i in articles:
        a = {}
        article = session.query(Articles).get(i.id)
        a["id"] = i.id
        a["blog_id"] = i.blog_id
        a["title"] = i.title
        a["image"] = i.image
        a["prev_content"] = i.prev_content
        # a["content"] = i.content
        a["category"] = i.category
        a["tags"] = i.tags
        a["date"] = i.date
        a["views"] = i.views
        a["author"] = {'login': user.login, "avatar": user.avatar}
        rez.append(a)

    session.close()
    return rez

def get_articles_blog_by_user_id(user_id):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    blog = session.query(Blog).filter_by(user_id=user_id).first()
    articles = session.query(Articles).filter_by(blog_id=blog.id).all()
    rez = []
    # for i in blog_articles:
        # articles.append(session.query(Articles).get(i.id))
    for i in articles:
        a = {}
        article = session.query(Articles).get(i.id)
        a["id"] = i.id
        rez.append(a)

    session.close()
    return rez

def set_article(user_id, title, image, prev_content, content, category, tags):
    title = title.strip()
    content = content.strip() 
    category = category.strip()
    tags = tags.strip()
    if title == '' or content == '' or category == '':
        raise EmptyValuesAreEntered
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    user = session.query(User).get(user_id)
    articles = user.blog.articles
    if prev_content == '':
        prev_content = content[:150]
    articles.append(Articles(title=title, image=image, prev_content=prev_content, content=content, category=category, tags=tags))
    session.commit()
    article_id = articles[-1].id
    session.close()
    return article_id

def set_subscription(user_id, blog_id):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    # user = session.query(User).get(user_id)
    subscription = Subscriptions(user_id=user_id, blog_id=blog_id)
    session.add(subscription)
    session.commit()
    session.close()

def del_article(article_id):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    article = session.query(Articles).get(article_id)
    session.delete(article)
    session.commit()
    session.close()

def del_subscription(user_id, blog_id):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    subscription = session.query(Subscriptions).filter_by(user_id=user_id, blog_id=blog_id).first()
    session.delete(subscription)
    session.commit()
    session.close()

def update_article(article_id, user_id, title, image, prev_content, content, category, tags):
    title = title.strip()
    content = content.strip() 
    category = category.strip()
    tags = tags.strip()
    if title == '' or content == '' or category == '':
        raise EmptyValuesAreEntered
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    article = session.query(Articles).get(article_id)
    user = session.query(User).get(user_id)

    if user.id == article.blog_id:
        if title != 'old':
            article.title = title
        if article.image != 'old':
            article.image = image
        if article.prev_content != 'old':
            article.prev_content = prev_content
        if article.content != 'old':
            article.content = content
        if article.category != 'old':
            article.category = category
        if article.tags != 'old':
            article.tags = tags    
        session.commit()
        session.close()
    else:
        session.commit()
        session.close()
        raise CreateArticleTokenError

def update_user(user_id, login, email):
    login = login.strip()
    email = email.strip() 
    if login == '' or email == '':
        raise EmptyValuesAreEntered
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    user = session.query(User).get(user_id)

    if login != 'old':
        user.login = login
    if email != 'old':
        user.email = email
            
    
    session.commit()
    session.close()

def add_user(login, email, password):
    login = login.strip()
    email = email.strip() 
    password = password.strip()
    if login == '' or email == '' or password == '':
        raise EmptyValuesAreEntered
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    login = login.lower()
    email = email.lower()
    user_login = session.query(User.id).filter_by(login=login).first()
    user_email = session.query(User.id).filter_by(email=email).first()
    if user_login == None and user_email == None:
      user = User(login=login, email=email, password=generate_password_hash(password))
      session.add(user)
      session.commit()
      user_id = user.id
      blog = Blog(user_id=user_id)
      session.add(blog)
      session.commit()
    elif user_email:
        raise SignupEmailError
    elif user_login:
        raise SignupLoginError
    session.close()

def get_user_id(email):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    try:
        email = email.lower()
        user_id = session.query(User.id).filter_by(email=email).first()[0]
    except TypeError:
        raise AccountNotFound
    finally:
        session.close()
    return user_id

def get_user_login(email):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    try:
        email = email.lower()
        login = session.query(User.login).filter_by(email=email).first()[0]
    except TypeError:
        raise AccountNotFound
    finally:
        session.close()
    return login

def request_user_avatar(email):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    email = email.lower()
    avatar = session.query(User.avatar).filter_by(email=email).first()[0]
    session.close()
    return avatar

def request_user(email):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    email = email.lower()
    user = session.query(User).filter_by(email=email).first()
    session.close()
    if not user:
        raise AccountNotFound
    return user.email, user.password

def check_admin(login_id):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    user = session.query(User).get(login_id)
    is_admin = user.admin
    session.close()
    return is_admin

def check_user_by_email(email):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    email = email.lower()
    user = session.query(User).filter_by(email=email).first()
    session.close()
    if not user:
        raise AccountNotFound
    return email

#Добавление кода восстановления в базу
def add_check_password(email):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    email = email.lower()
    user = session.query(User).filter_by(email=email).first()
    list_code = np.random.choice(a, 10).tolist()
    user.forgot_code = ''.join(list_code)
    code = user.forgot_code
    # print(code) для проверки
    session.commit()
    session.close()
    return code

def get_check_password(email):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    email = email.lower()
    code = session.query(User.forgot_code).filter_by(email=email).first()[0]
    session.close()
    return code

def request_user_login(email):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    email = email.lower()
    user = session.query(User).filter_by(email=email).first()
    session.close()
    if not user:
        raise AccountNotFound
    return user.login

def change_user_password(email, password_new):
    email = email.strip() 
    password_new = password_new.strip()
    if email == '' or password_new == '':
        raise EmptyValuesAreEntered
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    email = email.lower()
    user = session.query(User).filter_by(email=email).first()
    user.password = generate_password_hash(password_new)
    session.commit()
    session.close()

def remove_check_password(email):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    email = email.lower()
    user = session.query(User).filter_by(email=email).first()
    code = user.forgot_code
    code = 0
    session.commit()
    session.close()

def plus_view_on_article(login, article_id):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    try:
        user = session.query(User).filter_by(login=login).first()
        article = session.query(Articles).get(article_id)
        article.views += 1
        session.commit()
        session.close()
        return 1
    except:
        return 0
    
def get_profile_info(login):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    user = session.query(User).filter_by(login=login).first()
    subscrip = session.query(Subscriptions).filter_by(user_id=user.id).all()
    subscriptions = []
    subscribers = []
    for i in range(len(subscrip)):
        usr = session.query(User).get(subscrip[i].blog_id)
        sub = {
            'blog_id': usr.id,
            'login': usr.login,
            'avatar': usr.avatar
        }
        subscriptions.append(sub)
    subscrib = session.query(Subscriptions).filter_by(blog_id=user.id).all()
    for i in range(len(subscrib)):
        usr = session.query(User).get(subscrib[i].user_id)
        sub = {
            'blog_id': usr.id,
            'login': usr.login,
            'avatar': usr.avatar
        }
        subscribers.append(sub)
    rez = {
        "login": user.login,
        # "email": user.email,
        "blog_id": user.id,
        "avatar": user.avatar,
        "subscriptions": subscriptions,
        "subscribers": subscribers,
    }
    session.close()
    return rez


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


def generate_c_c():
    c_c = ''
    for i in range(6):
        c_c += str(randint(0, 9))
    return c_c

# add_user("AYE88", 'sss@mail.ru', "2281337")

# get_articles_subscriptions(1)