import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, create_engine, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, Session, backref
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash
engine = create_engine('sqlite:///info_data_base.db', echo=True)
Base = declarative_base(bind=engine)

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    admin = Column(Boolean, nullable=False, default=False)
    login = Column(String(50), nullable=False, unique=True)
    email = Column(String(254), nullable=False, unique=True)
    password = Column(String(20), nullable=False)
    avatar = Column(String, default='peppa.png', nullable=False)
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
    info = Column(String(65000), nullable=False, unique=False)
    # поставил такое ограничение просто так
    tags = Column(String(50), nullable=False)
    # будем редактировать ограничение исходя из длины всех тегов
    time = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    # время создания
    num_of_views = Column(Integer, default=0, nullable=False)
    blog = relationship("Blog")

class Subscriptions(Base):
    __tablename__ = 'subscriptions'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    blog_id = Column(Integer, ForeignKey('blog.id', ondelete='CASCADE'), nullable=False)
    blog = relationship(Blog)
    user = relationship(User)


Base.metadata.create_all()


def get_subscriptions(user_id):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    subscription = session.query(Subscriptions).filter_by(user_id=user_id)
    return subscription

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
    session.close()
    return article

def get_articles_subscriptions(user_id):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    subscription_s = session.query(Subscriptions).filter_by(user_id=user_id)
    sub = [i.blog.articles for i in subscription_s]
    session.close()
    return sub

def get_articles_blog(user_id):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    user = session.query(User).get(user_id)
    articles = user.blog.articles
    session.close()
    return articles

def set_article(user_id, info, tags):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    user = session.query(User).get(user_id)
    articles = user.blog.articles
    articles.append(Articles(info=info, tags=tags))
    session.commit()
    article_id = articles[-1].id
    session.close()
    return article_id

def set_subscription(user_id, blog_id):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    user = session.query(User).get(user_id).first()
    subscription = user.blog.subscriptions
    subscription.append(Subscriptions(user_id=user_id, blog_id=blog_id))
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
    subscription = session.query(Subscriptions).filter_by(user_id=user_id, blog_id=blog_id)
    session.delete(subscription)
    session.commit()
    session.close()

def update_article(article_id, info, tags):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    article = session.query(Articles).get(article_id)
    if tags == "old" and info != "old":
        article.info = info
    elif info == "old" and tags != "old":
        article.tags = tags
    elif info == "old" and tags == "old":
        pass
    else:
        article.info = info
        article.tags = tags
    session.commit()
    session.close()

def add_user(login, email, password):
    engine = create_engine('sqlite:///info_data_base.db', echo=True)
    session = Session(bind=engine)
    user = User(login=login, email=email, password=generate_password_hash(password))
    session.add(user)
    session.commit()
    user_id = user.id
    blog = Blog(user_id=user_id)
    session.add(blog)
    session.commit()
    session.close()
# add_user("AYE88", 'sss@mail.ru', "2281337")
