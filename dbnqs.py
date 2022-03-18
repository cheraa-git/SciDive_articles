import datetime
# from nis import cat
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, create_engine, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, Session
from werkzeug.security import generate_password_hash
import numpy as np
from excrptions import AccountNotFound, SignupLoginError, SignupEmailError, EmptyValuesAreEntered, CreateArticleTokenError
from send_mail import send_message
from auxiliary_funcs import generate_c_c


a = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
engine = create_engine('sqlite:///info_data_base.db', echo=True)
Base = declarative_base(bind=engine)


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    admin = Column(Boolean, nullable=False, default=False)
    login = Column(String(50), nullable=False, unique=True)
    email = Column(String(254), nullable=False, unique=True)
    password = Column(String(20), nullable=False)
    avatar = Column(String, default='default_avatar.png', nullable=False)
    is_confirmed_email = Column(Boolean, nullable=False, default=False)
    forgot_code = Column(String(10), nullable=False, unique=False, default=0)
    subscriptions = relationship("Subscriptions", cascade="all, delete-orphan")
    def __str__(self):
        return ' | '.join([str(self.id), self.login])

class Articles(Base):
    __tablename__ = 'articles'
    id = Column(Integer, primary_key=True)
    author_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
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
    user = relationship("Users")

class Subscriptions(Base):
    __tablename__ = 'subscriptions'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    subscription = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    user = relationship(User)


Base.metadata.create_all()


class MUsers():
# Работа со статьями 
    def get_articles_blog_by_user_id(self, user_id):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        articles = session.query(Articles).filter_by(author_id=user_id).all()
        rez = []
        for i in articles:
            a = {}
            a["id"] = i.id
            rez.append(a)
        session.close()
        return rez
# Работа с подписками
    def get_subscriptions(self, user_id):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        subscriptions = session.query(Subscriptions).filter_by(user_id=user_id)
        session.close()
        return subscriptions

    def add_subscription(self, user_id, subscription):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        subscrip = Subscriptions(user_id=user_id, subscription=subscription)
        session.add(subscrip)
        session.commit()
        session.close()

    def del_subscription(self, user_id, subscription):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        subscrip = session.query(Subscriptions).filter_by(user_id=user_id, subscription=subscription).first()
        session.delete(subscrip)
        session.commit()
        session.close()
# Добавление пользователя
    def add(self, login, email, password):
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
        elif user_email:
            raise SignupEmailError
        elif user_login:
            raise SignupLoginError
        session.close()
# Получение данных
    def get_id(self, email):
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

    def get_login(self, email):
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

    def get_email(self, user_id):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        try:
            email = session.query(User.email).filter_by(id=user_id).first()[0]
        except TypeError:
            raise AccountNotFound
        finally:
            session.close()
        return email

    def get_is_confirmed_email(self, email):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        try:
            email = email.lower()
            user_id = session.query(User.is_confirmed_email).filter_by(email=email).first()[0]
        except TypeError:
            raise AccountNotFound
        finally:
            session.close()
        return user_id

    def request_avatar(self, email):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        email = email.lower()
        avatar = session.query(User.avatar).filter_by(email=email).first()[0]
        session.close()
        return avatar

    def request(self, email):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        email = email.lower()
        user = session.query(User).filter_by(email=email).first()
        session.close()
        if not user:
            raise AccountNotFound
        return user.email, user.password

    def check_admin(self, login_id):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        user = session.query(User).get(login_id)
        is_admin = user.admin
        session.close()
        return is_admin

    def get_profile_info(self, login):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        user = session.query(User).filter_by(login=login).first()
        subscrip = session.query(Subscriptions).filter_by(user_id=user.id).all()
        print(subscrip)
        for i in range(len(subscrip)):
            usr = session.query(User).get(subscrip[i].subscription)
            sub = {
                'blog_id': usr.id,
                'login': usr.login,
                'avatar': usr.avatar
            }
            subscriptions = {i: sub}
        subscrib = session.query(Subscriptions).filter_by(subscription=user.id).all()
        print(subscrib)
        for i in range(len(subscrib)):
            usr = session.query(User).get(subscrib[i].user_id)
            sub = {
                'blog_id': usr.id,
                'login': usr.login,
                'avatar': usr.avatar
            }
            subscribers = {i: sub}
        rez = {
            "login": user.login,
            "email": user.email,
            "avatar": user.avatar,
            "subscriptions": subscriptions,
            "subscribers": subscribers,
        }
        session.close()
        return rez
# Подтверждение почты
    def on_confirmed_email(self, user_id):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        user = session.query(User).filter_by(id=user_id).first()
        user.is_confirmed_email == True
        session.commit()
        session.close()

    def off_confirmed_email(self, user_id):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        user = session.query(User).filter_by(id=user_id).first()
        user.is_confirmed_email == False
        session.commit()
        session.close()

# Изменение данных
    def add_forgot_code(self, email):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        email = email.lower()
        user = session.query(User).filter_by(email=email).first()
        if not user:
            session.close()
            raise AccountNotFound
        if user.is_confirmed_email == True:
            code = generate_c_c()
            user.forgot_code = code
            session.commit()
            send_message(email, 'Код подтверждения для смены данных', f'Ваш код подтврежднеия: {code}')
        session.close()

    def change_login(self, user_id, old_login, new_login, forgot_code):
        old_login = old_login.strip()
        new_login = new_login.strip() 
        if old_login == '' or new_login == '':
            raise EmptyValuesAreEntered
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        user = session.query(User).get(user_id)
        if old_login != new_login and user.forgot_code == forgot_code and user.forgot_code != 0 and user.is_confirmed_email == True:
            user.login = new_login 
            user.forgot_code = 0   
        session.commit()
        session.close()

    def change_email(self, user_id, old_email, new_email, forgot_code):
        old_email = old_email.strip()
        new_email = new_email.strip() 
        if old_email == '' or new_email == '':
            raise EmptyValuesAreEntered
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        user = session.query(User).get(user_id)
        if old_email != new_email and user.forgot_code == forgot_code and user.forgot_code != 0 and user.is_confirmed_email == True:
            user.login = new_email    
            user.forgot_code = 0
            user.is_confirmed_email == False
        session.commit()
        session.close()

    def change_password(self, user_id, old_password, new_password, forgot_code):
        old_password = old_password.strip()
        new_password = new_password.strip() 
        if old_password == '' or new_password == '':
            raise EmptyValuesAreEntered
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        user = session.query(User).get(user_id)
        new_password = generate_password_hash(new_password)
        if old_password != new_password and user.forgot_code == forgot_code and user.forgot_code != 0 and user.is_confirmed_email == True:
            user.login = new_password  
            user.forgot_code = 0  
        session.commit()
        session.close()

    def change_avatar(self, user_id, new_avatar_path):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        user = session.query(User).get(user_id)
        user.avatar = new_avatar_path  
        session.commit()
        session.close()
# Удаление
    def remove(self, user_id, forgot_code):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        user = session.query(User).get(user_id)
        if user.forgot_code == forgot_code and user.is_confirmed_email == True:
            session.delete(user)
        session.commit()
        session.close()


class MArticles():
    def get(self, article_id):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        article = session.query(Articles).get(article_id)
        author = session.query(User).get(article.author_id)
        session.close()
        return article, author

    def add(self, user_id, title, image, prev_content, content, category, tags):
        title = title.strip()
        content = content.strip() 
        category = category.strip()
        tags = tags.strip()
        if title == '' or content == '' or category == '':
            raise EmptyValuesAreEntered
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        user = session.query(User).get(user_id)
        articles = user.articles
        if prev_content == '':
            prev_content = content[:150]
        articles.append(Articles(title=title, image=image, prev_content=prev_content, content=content, category=category, tags=tags, author_id=user_id))
        session.commit()
        article_id = articles[-1].id
        session.close()
        return article_id

    def update(self, article_id, user_id, title, image, prev_content, content, category, tags):
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
        if user.id == article.author_id:
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

    def remove(self, article_id):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        article = session.query(Articles).get(article_id)
        session.delete(article)
        session.commit()
        session.close()

    def plus_view(self, login, article_id):
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

class Feed():
    def get_most_recent_articles(self):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        articles = session.query(Articles).order_by(Articles.date).limit(30).all()
        rez = []
        for i in articles:
            a = {}
            author = session.query(User).get(i.author_id)
            a["id"] = i.id
            a["blog_id"] = i.author_id
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

    def get_articles_subscriptions(self, user_id):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        subscription_s = session.query(Subscriptions).filter_by(user_id=user_id).all()
        sub = [i.subscription for i in subscription_s]
        sub_s = []
        for i in subscription_s:
            author = session.query(User).get(i.subscription)
            articles = session.query(Articles).filter_by(author_id=author.id).all()
            for k in articles:
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
                a["author"] = {'login': author.login, "avatar": author.avatar}
                sub_s.append(a)
        session.close()
        return sub_s

    def get_articles_blog(self, login):
        engine = create_engine('sqlite:///info_data_base.db', echo=True)
        session = Session(bind=engine)
        user = session.query(User).filter_by(login=login).first()
        articles = session.query(Articles).filter_by(author_id=user.id).all()
        rez = []
        for i in articles:
            a = {}
            # article = session.query(Articles).get(i.id)
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